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
import {
  selectUserId,
  selectWishlist,
} from "./lib/redux/features/sliceSelectors";
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
  const wishlist = useSelector(selectWishlist);
  const userId = useSelector(selectUserId);
  const productsDetails = useSelector(selectProductsDetails);

  const handleWishlistToggle = async (item) => {
    try {
      if (!userId) {
        console.error("User not authenticated");
        window.location.href = "/login";
        return;
      }

      // Check if the item is already in the wishlist
      const isInWishlist = wishlist.some(
        (wishlistItem) => wishlistItem._id === item._id,
      );

      if (isInWishlist) {
        // Remove from wishlist
        dispatch(removeFromWishlist(item._id)); // Dispatch Redux action to remove
        await axios.put(
          `${process.env.REACT_APP_API_URL}/users/${userId}/wishlist`,
          {
            productId: item._id,
            action: "remove",
          },
        );
      } else {
        // Add to wishlist
        dispatch(addToWishlist(item)); // Dispatch Redux action to add
        await axios.put(
          `${process.env.REACT_APP_API_URL}/users/${userId}/wishlist`,
          {
            productId: item._id,
            action: "add",
          },
        );
      }
    } catch (error) {
      console.error("Error updating wishlist", error.message);
      window.location.href = "/login";
    }
  };
  useEffect(() => {
    const getSessionIdFromCookies = async () => {
      const cookies = document.cookie
        .split("; ")
        .find((row) => row.startsWith("sessionId="));
      if (cookies) {
        const sessionId = cookies.split("=")[1];
        if (!userId) {
          dispatch(setUserId(sessionId));
        }
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/users/${sessionId}`,
            {
              withCredentials: true,
            },
          );
          const user = response.data;
          if (user && user.wishlist) {
            dispatch(setUser(user));
            dispatch(setWishlist(user.wishlist)); // Dispatch action to set the initial wishlist
          }
        } catch (error) {
          console.error("Error fetching user:", error.message);
        }
      }
    };
    getSessionIdFromCookies();
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
              <ProductList handleWishlistToggle={handleWishlistToggle} />
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProductItem handleWishlistToggle={handleWishlistToggle} />
            }
          ></Route>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/wishlist"
            element={<WishList onRemoveItem={handleWishlistToggle} />}
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
