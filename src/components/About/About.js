import "./About.css";
import React from "react";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-title">About Us</div>

      <div className="about-section">
        <div className="about-section-title">Our Mission</div>
        <p>
          We are dedicated to providing the best products and services for our
          customers. Our mission is to bring innovation closer to people through
          customized solutions and a unique experience.
        </p>
      </div>

      <div className="about-section">
        <div className="about-section-title">Our History</div>
        <p>
          Founded in 2024, our company has continuously evolved to meet the
          changing needs of the market. With a team of dedicated professionals
          and a client-focused vision, we have rapidly expanded and established
          lasting partnerships.
        </p>
      </div>

      <div className="about-section">
        <div className="about-section-title">Our Values</div>
        <p>
          Integrity, innovation, and commitment to our customers are the values
          that guide our every action. We believe our success is built on the
          trust we earn from our clients and partners.
        </p>
      </div>
    </div>
  );
};

export default About;
