import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../SignIn/SignIn.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "../../lib/redux/features/sliceSelectors";
import { clearUserId } from "../../lib/redux/features/userSlice";
import { MoonLoader } from "react-spinners";
import { toast } from "react-toastify";
import {clearWishlist} from "../../lib/redux/features/wishlistSlice";

function Logout() {
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/logout`,
        {},
        { withCredentials: true },
      );
      console.log(response.data.message);
      document.cookie = "sessionId=; path=/; max-age=0; secure; samesite=None";
      dispatch(clearUserId());
      dispatch(clearWishlist());
      toast.success(`Logged out successfully!`);
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response ? error.response.data : error.message,
      );
      toast.error(`Error logging out!`);
    }
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <main className="main-sign_in_container">
          <MoonLoader size={60} color="black"></MoonLoader>
        </main>
      ) : (
        <main className="main-sign_in_container">
          {userId ? (
            <div className={"logout-title"}>Confirm logout</div>
          ) : (
            <div className={"logout-title"}>Logout successfully</div>
          )}
          {userId ? (
            <div className="logout-btn-container">
              <button className="logout-btn" onClick={handleLogout}>
                Confirm
              </button>
            </div>
          ) : (
            <div className="btn-container">
              <Link className="logout-btn" to={"/"}>
                Collection
              </Link>
              <Link className="logout-btn" to={"/sign-in"}>
                Sign in
              </Link>
              <Link className="logout-btn" to={"/sign-up"}>
                Sign up
              </Link>
            </div>
          )}
        </main>
      )}
    </>
  );
}

export default Logout;
