import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles.css";
import { useSelector } from "react-redux";
import {
  selectUser,
  selectUserId,
  selectWishlist,
} from "../../lib/redux/features/sliceSelectors";

const Header = () => {
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false); // New state for dropdown
  const userId = useSelector(selectUserId);
  const user = useSelector(selectUser);
  const wishlist = useSelector(selectWishlist);

  const handleItemClick = () => {
    setShowMobileSidebar(true);
    setShowDropdown(false); // Close dropdown on navigation
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); // Toggle dropdown visibility
  };

  const navigationLinks = [
    { label: "Collection", Path: "/" },
    { label: "About", Path: "/about" },
    { label: "Help", Path: "/help" },
    { label: "Cart", Path: "/wishlist" },
    { label: "Login", Path: "/sign-in" },
  ];

  const navigationLinksLoggedIn = [
    { label: "Collection", Path: "/" },
    { label: "About", Path: "/about" },
    { label: "Help", Path: "/help" },
    { label: "Cart", Path: "/wishlist" },
  ];

  return (
    <header>
      {/* Mobile Menu Icon */}
      <nav>
        <div className="navtop">
          <h3>
            <Link
              to="/"
              onClick={() => showMobileSidebar && setShowMobileSidebar(false)}
              className="project-title"
            >
              MINGLE®
            </Link>
          </h3>
          <div
            className={`mobile-menu-icon ${!showMobileSidebar ? "active" : ""}`}
            onClick={() => {
              setShowMobileSidebar(!showMobileSidebar);
              setShowDropdown(false);
            }}
          >
            {Array.from({ length: 2 + showMobileSidebar }, (_, i) => (
              <div
                key={i}
                className={
                  i === 0 ? "firstbar" : i === 1 ? "secondbar" : "lastbar"
                }
              />
            ))}
          </div>
        </div>
      </nav>
      <ul className={`desktop-nav ${showMobileSidebar ? "" : "show"}`}>
        {userId ? (
          <>
            {navigationLinksLoggedIn.map((item, key) => (
              <li key={key} onClick={handleItemClick}>
                <Link
                  className={"navigationLinks"}
                  to={item.Path}
                  style={
                    item.label === "Cart"
                      ? { display: "flex", alignItems: "center", gap: 4 }
                      : {}
                  }
                >
                  {item.label}
                  {item.label === "Cart" && (
                    <div className="cart-count">{wishlist.length}</div>
                  )}
                </Link>
              </li>
            ))}

            {user !== null && (
              <li className="dropdown">
                <span onClick={toggleDropdown} className="navigationLinks">
                  {user.name}▼
                </span>
                {showDropdown && (
                  <ul className="dropdown-menu">
                    <li onClick={handleItemClick}>
                      <Link to="/reset-password" className="navigationLinks">
                        Settings
                      </Link>
                    </li>
                    <li onClick={handleItemClick}>
                      <Link to="/logout" className="navigationLinks">
                        Logout
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
            )}
          </>
        ) : (
          navigationLinks.map((item, key) => (
            <li key={key} onClick={handleItemClick}>
              <Link className={"navigationLinks"} to={item.Path}>
                {item.label}
              </Link>
            </li>
          ))
        )}
      </ul>
    </header>
  );
};

export default Header;
