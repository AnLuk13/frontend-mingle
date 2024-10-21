import React, { useState } from "react";
import "./SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setUser, setUserId } from "../../lib/redux/features/userSlice";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";

const SignIn = () => {
  const [error, setError] = useState("");
  const [signInDetails, setSignInDetails] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOnchange = (e) => {
    setSignInDetails({
      ...signInDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (signInDetails.email === "" || signInDetails.password === "") {
      setError("Please fill in all the required fields");
      return;
    }
    try {
      const loginResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          email: signInDetails.email,
          password: signInDetails.password,
        },
        { withCredentials: true },
      );
      const userId = jwtDecode(loginResponse.data.token).id;
      dispatch(setUserId(userId));
      const userResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/${userId}`,
        { withCredentials: true },
      );
      dispatch(setUser(userResponse.data));
      navigate("/");
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <main className="main-sign_in_container">
      <div className="sign-in-title" style={{ textAlign: "center" }}>
        Sign in
      </div>
      <form onSubmit={handleSubmit} className="sign-in-container">
        <p className="error">{error !== "" ? `Error: ${error}` : null}</p>
        <div className="input-div">
          <label className="input-label" htmlFor="email">
            Email
          </label>
          <input
            className="inputCustom"
            name="email"
            id="email"
            type="email"
            placeholder="Enter your email"
            onChange={handleOnchange}
            value={signInDetails.email}
          />
        </div>

        <div className="input-div">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <Link to={"/reset-password"} className="forgot-btn">
              Forgot?
            </Link>
          </div>

          <input
            className="inputCustom"
            name="password"
            id="password"
            type="password"
            placeholder="Enter your password"
            onChange={handleOnchange}
            value={signInDetails.password}
          />
        </div>

        <button className="sign-in-button">Login</button>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div className="small-txt"> Don't have an account?</div>
          <Link className="forgot-btn" to="/sign-up">
            Sign up
          </Link>
        </div>
      </form>
    </main>
  );
};

export default SignIn;
