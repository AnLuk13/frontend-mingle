import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setUserId } from "../../lib/redux/features/userSlice";
import "./ResetPassword.css";

function ResetPassword() {
  const [userDetails, setUserDetails] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });
  const [message, setMessage] = useState({ error: "", success: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirm_password } = userDetails;

    if (password !== confirm_password) {
      return setMessage({ error: "Passwords do not match", success: "" });
    }

    try {
      // Step 1: Call reset-password endpoint
      const resetPasswordResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/reset-password`,
        {
          email,
          newPassword: password,
        },
      );

      // Step 2: Get the sessionId from the response
      const sessionId = resetPasswordResponse.data.sessionId;

      // Step 3: Set the sessionId cookie manually
      document.cookie = `sessionId=${sessionId}; path=/; max-age=${
        24 * 60 * 60
      }; secure; samesite=None`;

      // Step 4: Fetch the user details with the sessionId
      const userResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/${sessionId}`,
      );

      // Step 5: Dispatch actions to set the userId and user details in state
      dispatch(setUserId(sessionId));
      dispatch(setUser(userResponse.data));

      // Step 6: Set a success message and navigate to the homepage
      setMessage({ error: "", success: "Password reset and login successful" });
      navigate("/");
    } catch (error) {
      // Handle any errors during the reset process
      setMessage({
        error: "Error resetting password or logging in",
        success: "",
      });
    }
  };

  return (
    <main className="main-reset-password_container">
      <div className="reset-password-title" style={{ textAlign: "center" }}>
        Reset password
      </div>
      <form onSubmit={handleSubmit} className="reset-password-container">
        {message.error && (
          <p className="error-paragraph">Error: {message.error}</p>
        )}
        {["email", "password", "confirm_password"].map((field, idx) => (
          <div key={idx} className="input-div">
            <label className="input-label" htmlFor={field}>
              {field.replace("_", " ").toUpperCase()}
            </label>
            <input
              className="inputCustom"
              name={field}
              id={field}
              type={field === "email" ? "email" : "password"}
              onChange={handleChange}
              value={userDetails[field]}
              placeholder={
                field === "email"
                  ? "Enter email"
                  : field === "password"
                    ? "Enter new password"
                    : "Confirm password"
              }
            />
          </div>
        ))}
        <button className="reset-password-button">Reset Password</button>
        <div className="small-txt-container">
          <div className="small-txt">Already have an account?</div>
          <Link className="forgot-btn" to="/sign-in">
            Sign in
          </Link>
        </div>
      </form>
    </main>
  );
}

export default ResetPassword;
