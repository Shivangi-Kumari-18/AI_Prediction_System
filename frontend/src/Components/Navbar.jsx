import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../context/AuthContext";
import Login from "./pages/Login"; // 👈 Login component import
import SignUp from "./pages/SignUp";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-inner">
          {/* Logo */}
          <div
            className="navbar-logo"
            onClick={() => navigate(isAuthenticated ? "/home" : "/login")}
          >
            AI<span>Prediction</span>
          </div>

          {/* Desktop Menu */}
          <ul className="navbar-menu">
            {isAuthenticated ? (
              <>
                <li>
                  <NavLink to="/home" className="navbar-link">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/features" className="navbar-link">
                    Features
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" className="navbar-link">
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/contact" className="navbar-link">
                    Contact
                  </NavLink>
                </li>
                <li>
                  <button
                    type="button"
                    className="navbar-login"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login" className="navbar-link">
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/signup" className="navbar-link">
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          {/* Hamburger */}
          <button
            type="button"
            className="hamburger"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <ul className="mobile-menu-list">
          {isAuthenticated ? (
            <>
              <li>
                <NavLink
                  to="/home"
                  className="mobile-menu-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/features"
                  className="mobile-menu-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Features
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className="mobile-menu-link"
                  onClick={() => setMenuOpen(false)}
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className="mobile-menu-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Contact
                </NavLink>
              </li>
              <li>
                <button
                  type="button"
                  className="mobile-login"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className="mobile-menu-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/signup"
                  className="mobile-menu-link"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
