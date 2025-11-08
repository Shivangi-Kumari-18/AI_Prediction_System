import React from "react";
import { FaUserShield, FaEnvelope, FaLock } from "react-icons/fa";
import "./AdminLogin.css"; // Separate CSS for styling

export default function AdminLogin({ handleSubmit, email, setEmail, password, setPassword }) {
  return (
    <div className="admin-login-container">
      <div className="admin-card">
        <div className="admin-header">
          <FaUserShield className="admin-icon" />
          <h2>Admin Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

        </form>
      </div>
    </div>
  );
}

