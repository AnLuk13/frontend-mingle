import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, setUserId } from "../../lib/redux/features/userSlice";
import "./ResetPassword.css";
import { jwtDecode } from "jwt-decode";

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
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password`, {
        email,
        newPassword: password,
      });
      const loginResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        { email, password },
      );
      const decoded = jwtDecode(loginResponse.data.token).id;
      dispatch(setUserId(decoded));
      const userResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/${decoded}`,
      );
      dispatch(setUser(userResponse.data));
      setMessage({ error: "", success: "Password reset and login successful" });
      navigate("/");
    } catch (error) {
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
