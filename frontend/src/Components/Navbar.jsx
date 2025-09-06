import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import Login from "./pages/Login"; // 👈 Login component import

const Navbar = () => {
  const [open, setOpen] = useState(false); // mobile menu state
  const [loginOpen, setLoginOpen] = useState(false); // login modal state

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-inner">
            {/* Logo */}
            <div className="navbar-logo">
              AI<span>Prediction</span>
            </div>

            {/* Desktop Menu */}
            <ul className="navbar-menu">
              <li>
                <NavLink to="/" className="navbar-link">
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
                {/* ✅ Instead of NavLink, open modal */}
                <button
                  className="navbar-login"
                  onClick={() => setLoginOpen(true)}
                >
                  Login
                </button>
              </li>
            </ul>

            {/* Hamburger */}
            <button className="hamburger" onClick={() => setOpen(!open)}>
              {open ? "✖" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${open ? "open" : ""}`}>
          <ul className="mobile-menu-list">
            <li>
              <NavLink
                to="/"
                className="mobile-menu-link"
                onClick={() => setOpen(false)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/features"
                className="mobile-menu-link"
                onClick={() => setOpen(false)}
              >
                Features
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className="mobile-menu-link"
                onClick={() => setOpen(false)}
              >
                About
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className="mobile-menu-link"
                onClick={() => setOpen(false)}
              >
                Contact
              </NavLink>
            </li>
            <li>
              {/* ✅ Mobile Login also opens modal */}
              <button
                className="mobile-login"
                onClick={() => {
                  setOpen(false);
                  setLoginOpen(true);
                }}
              >
                Login
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* ✅ Login Modal Render */}
      <Login open={loginOpen} setOpen={setLoginOpen} />
    </>
  );
};

export default Navbar;
