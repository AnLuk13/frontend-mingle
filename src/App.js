import "./App.css";
import "@google/model-viewer/dist/model-viewer.min.js";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import ProductList from "./components/ProductList/ProductList";
import About from "./components/About/About";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Feedback from "./components/Feedback/Feedback";
import SignUp from "./components/SignUp/SignUp";
import SignIn from "./components/SignIn/SignIn";
import WishList from "./components/Wishlist/WishList";
import { useEffect } from "react";
import Logout from "./components/Logout/Logout";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "./lib/redux/features/sliceSelectors";
import {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
} from "./lib/redux/features/wishlistSlice";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import ProductItem from "./components/ProductItem/ProductItem";
import {
  fetchProducts,
  selectProductsDetails,
} from "./lib/redux/features/productsSlice";
import ChatBot from "./components/Chatbot/ChatBot";
import { setUser, setUserId } from "./lib/redux/features/userSlice";

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);
  const productsDetails = useSelector(selectProductsDetails);

  console.log(process.env.REACT_APP_API_URL);

  const handleAddToWishlist = async (item) => {
    try {
      if (!userId) {
        console.error("User not authenticated");
        return;
      }
      dispatch(addToWishlist(item));
      await axios.put(
        `${process.env.REACT_APP_API_URL}/users/${userId}/wishlist`,
        {
          productId: item._id,
        },
      );
    } catch (error) {
      window.location.href = "/login";
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      if (!userId) {
        console.error("User not authenticated");
        return;
      }
      dispatch(removeFromWishlist(id)); // Use Redux to remove from wishlist
      await axios.put(
        `${process.env.REACT_APP_API_URL}/users/${userId}/wishlist`,
        {
          productId: id,
        },
      );
    } catch (error) {
      console.error("Error removing product from wishlist", error.message);
    }
  };

  useEffect(() => {
    const getUserFromToken = async () => {
      try {
        // Make the request to the backend to validate the session and retrieve user info
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/auth/session`,
          {
            withCredentials: true, // Ensures the cookie is sent along with the request
          },
        );

        // Extract user data from the response
        const decodedUserId = response.data.userId;
        if (!userId) {
          dispatch(setUserId(decodedUserId));
        }

        const userResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/users/${decodedUserId}`,
          {
            withCredentials: true,
          },
        );
        const user = userResponse.data;
        if (user && user.wishlist) {
          dispatch(setUser(user));
          dispatch(setWishlist(user.wishlist));
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };
    getUserFromToken();
  }, [userId, dispatch]);

  useEffect(() => {
    if (productsDetails?.status === "idle") {
      dispatch(fetchProducts());
    }
  }, [productsDetails?.status, dispatch]);

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <ProductList
                addToWishlist={handleAddToWishlist}
                removeFromWishlist={handleRemoveItem}
              />
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProductItem
                addToWishlist={handleAddToWishlist}
                removeFromWishlist={handleRemoveItem}
              />
            }
          ></Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/wishlist"
            element={<WishList onRemoveItem={handleRemoveItem} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <Footer />
        <ChatBot />
      </BrowserRouter>
    </>
  );
};

export default App;
