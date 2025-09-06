import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css"; // 👈 normal CSS import

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-inner">
          {/* Logo */}
          <div className="navbar-logo">
            Edu<span>Guard</span>
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
              <NavLink to="/login" className="navbar-login">
                Login
              </NavLink>
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
            <NavLink
              to="/login"
              className="mobile-login"
              onClick={() => setOpen(false)}
            >
              Login
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
