import React from "react";
import "./Error.css";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="err-container">
      <div className="error-txt">404</div>
      <Link className="error-btn" to="/">
        Go to Homepage
      </Link>
    </div>
  );
};

export default ErrorPage;
