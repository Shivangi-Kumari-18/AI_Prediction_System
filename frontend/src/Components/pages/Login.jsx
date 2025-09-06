import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // 👈 normal CSS import

const Login = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        { email, password }
      );
      setMessage("Login successful ✅");
    } catch (err) {
      setMessage(err.response?.data?.msg || "Login failed ❌");
    }
  };

  return (
    <div>
      {/* Trigger Button */}
      <button onClick={() => setOpen(true)} className="login-btn">
        Login
      </button>

      {/* Modal */}
      {open && (
        <div className="modal-overlay">
          <div className="modal-box">
            {/* Close Button */}
            <button onClick={() => setOpen(false)} className="modal-close">
              ✖
            </button>

            {/* Title */}
            <h2 className="modal-title">Login</h2>

            {/* Form */}
            <form className="modal-form" onSubmit={handleLogin}>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="modal-input"
                  required
                />
              </div>
              <div>
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="modal-input"
                  required
                />
              </div>
              {message && <p className="modal-message">{message}</p>}
              <button type="submit" className="modal-submit">
                Login
              </button>
            </form>

            {/* Links */}
            <p className="modal-footer">
              <Link to="/forgot-password">Forgot Password?</Link> |{" "}
              <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
