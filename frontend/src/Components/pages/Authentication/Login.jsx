import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { useAuth } from "../../../context/AuthContext";
import "../Dashboards/Dashboard";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!API_URL) return setMessage("API URL not configured (VITE_API_URL)");

    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const data = res?.data || {};
      console.log("🔑 Login response:", data);
      if (data.success) {
        // store token and user in context (and localStorage via AuthContext.login)
        login({ token: data.token, user: data.user });
        setMessage(data.msg || "Login successful ✅");
        navigate("/dashboard", { replace: true });
      } else {
        // handle non-success responses (user not found vs invalid password)
        const msg = data.msg || "Login failed ❌ Please try again";
        setMessage(msg);

        const lowered = String(msg).toLowerCase();
        if (
          lowered.includes("not found") ||
          lowered.includes("no user") ||
          lowered.includes("doesn't exist")
        ) {
          // let user read message
          setTimeout(() => navigate("/signup", { replace: true }), 1200);
        }
        // if message includes "invalid password" or "wrong password", stay on login (message shown)
      }
    } catch (err) {
      console.error("Login error:", err);
      const errMsg =
        err?.response?.data?.msg || err?.message || "Login failed ❌";
      setMessage(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {message && <p className="modal-message">{message}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-links">
          <Link to="/forgot-password">Forgot Password?</Link> |{" "}
          <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
