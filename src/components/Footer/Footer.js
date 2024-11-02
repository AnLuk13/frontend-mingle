import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <div className="contact" id="contact">
      <div className="main-content">
        <div className="contact-content">
          <Link to="/"> Collection </Link>
          <Link to="/about">About</Link>
          <Link to="/help"> Help </Link>
        </div>

        <div className="contact-content">
          <Link to="/"> Shipping & Returns </Link>
          <Link to="/"> Store Policy </Link>
          <Link to="/"> Payment Methods </Link>
        </div>

        <div className="contact-content">
          <Link to="/help"> FAQ </Link>
          <Link to="" target="_blank">
            Contact
          </Link>
          <Link to="/"> +(373) 000-000-000 </Link>
        </div>

        <div className="contact-content">
          <Link to="" target="_blank">
            Instagram
          </Link>
          <Link to="" target="_blank">
            Facebook
          </Link>
          <Link to="" target="_blank">
            X
          </Link>
        </div>
      </div>
      <div className="last">
        <p style={{ fontSize: 16 }}>® 2024 MINGLE | All Rights Reserved</p>
      </div>
    </div>
  );
}

export default Footer;
