import "./App.css";
import "@google/model-viewer/dist/model-viewer.min.js";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import ProductList from "./components/ProductList/ProductList";
import About from "./components/About/About";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
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
import { ToastContainer, Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SupportForm from "./components/Support/SupportForm";

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
        window.location.href = "/sign-in";
        return;
      }
      const isInWishlist = wishlist.some(
        (wishlistItem) => wishlistItem._id === item._id,
      );
      if (isInWishlist) {
        dispatch(removeFromWishlist(item._id));
        await axios.put(
          `${process.env.REACT_APP_API_URL}/users/${userId}/wishlist`,
          {
            productId: item._id,
            action: "remove",
          },
        );
        toast.error(`${item.name} removed from wishlist!`);
      } else {
        dispatch(addToWishlist(item));
        await axios.put(
          `${process.env.REACT_APP_API_URL}/users/${userId}/wishlist`,
          {
            productId: item._id,
            action: "add",
          },
        );
        toast.success(`${item.name} added to wishlist!`);
      }
    } catch (error) {
      console.error("Error updating wishlist", error.message);
      window.location.href = "/sign-in";
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
            dispatch(setWishlist(user.wishlist));
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
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
          style={{ top: "85px" }}
        />
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
            element={<WishList handleWishlistToggle={handleWishlistToggle} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<SupportForm />} />
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
