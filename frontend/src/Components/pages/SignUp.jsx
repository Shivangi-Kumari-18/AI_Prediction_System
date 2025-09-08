// src/Components/pages/SignUp.jsx
import React, { useState } from "react";
import axios from "axios";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSignUp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setMessage("");
    if (!name || !email || !password) {
      setMessage("All fields are required ❌");
      return;
    }
    if (!API_URL) {
      setMessage("API URL not configured (VITE_API_URL)");
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      const data = res?.data || {};
      console.log("Signup response:", data);

      if (data.success) {
        navigate("/login", { replace: true }); // redirect immediately
      } else {
        setMessage(data.msg || "Signup failed ❌");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage(
        err?.response?.data?.msg || err?.message || "Error signing up ❌"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-box">
        <h2>Create Account</h2>
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {message && <p className="message">{message}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Sign Up 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}
