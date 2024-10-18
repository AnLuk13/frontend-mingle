import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import { setUser, setUserId } from "../../lib/redux/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId } from "../../lib/redux/features/sliceSelectors";

const SignUp = () => {
  const [error, setError] = useState("");
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const userId = useSelector(selectUserId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      navigate("/");
    }
  }, []);

  const handleOnChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      userDetails.confirm_password === "" ||
      userDetails.password === "" ||
      userDetails.email === "" ||
      userDetails.name === ""
    ) {
      setError("Please fill in all the required fields");
      return;
    }
    if (userDetails.password !== userDetails.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    try {
      const signupResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/users`,
        {
          name: userDetails.name,
          email: userDetails.email,
          password: userDetails.password,
        },
        { withCredentials: true },
      );
      const loginResponse = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          email: signupResponse.data.email, // Use email from the signup response
          password: userDetails.password, // Use the same password user provided for signup
        },
        { withCredentials: true },
      );
      const userId = loginResponse.data.sessionId;
      dispatch(setUserId(userId));
      const userResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/${userId}`,
        { withCredentials: true },
      );
      dispatch(setUser(userResponse.data));
      setError("");
      setUserDetails({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      navigate("/");
    } catch (error) {
      console.error(error);
      setError("Error during signup or login. Please try again.");
    }
  };

  return (
    <main className="main-sign_up_container">
      <div className="sign-up-title" style={{ textAlign: "center" }}>
        Sign up
      </div>
      <form onSubmit={handleSubmit} className="sign-up-container">
        <p className="error-paragraph">
          {error !== "" ? `Error: ${error}` : null}
        </p>
        <div className="input-div">
          <label className="input-label" htmlFor="name">
            Name
          </label>
          <input
            className="inputCustom"
            name="name"
            id="name"
            type="text"
            onChange={handleOnChange}
            value={userDetails.name}
          />
        </div>
        <div className="input-div">
          <label className="input-label" htmlFor="email">
            Email
          </label>
          <input
            className="inputCustom"
            name="email"
            id="email"
            type="email"
            onChange={handleOnChange}
            value={userDetails.email}
          />
        </div>
        <div className="input-div">
          <label className="input-label" htmlFor="password">
            Password
          </label>
          <input
            className="inputCustom"
            name="password"
            id="password"
            type="password"
            onChange={handleOnChange}
            value={userDetails.password}
          />
        </div>
        <div className="input-div">
          <label className="input-label" htmlFor="confirm_password">
            Confirm Password
          </label>
          <input
            className="inputCustom"
            name="confirm_password"
            id="confirm_password"
            type="password"
            onChange={handleOnChange}
            value={userDetails.confirm_password}
          />
        </div>
        <button className="sign-up-button">Sign up</button>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div className="small-txt">Already have an account?</div>
          <Link className="forgot-btn" to="/sign-in">
            Sign in
          </Link>
        </div>
      </form>
    </main>
  );
};

export default SignUp;
