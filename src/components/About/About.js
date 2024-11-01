import "./About.css";
import React, { useEffect } from "react";

const About = () => {
  useEffect(() => {
    const sections = document.querySelectorAll(
      ".fromtop-anim, .fade-effect, .aboutrightsec, .left-img-effect, .right-img-effect",
    );

    const observer = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });
  }, []);

  const [showScrollUpButton, setShowScrollUpButton] = React.useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const showButtonThreshold = 200;

      // Show the scroll-up button when the user scrolls down
      setShowScrollUpButton(scrollY > showButtonThreshold);
    };

    // Add event listener for scroll
    window.addEventListener("scroll", handleScroll);

    // Remove event listener when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="about-container">
      <div>test</div>
      {showScrollUpButton && (
        <button className="scroll-up-button" onClick={scrollToTop}>
          AAA
        </button>
      )}
    </div>
  );
};

export default About;
