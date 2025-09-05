import React, { useState } from "react";
import "./LoginSignUp.css";
import user_icon from "../Assets/person.png";
import email_icon from "../Assets/email.png";
import password_icon from "../Assets/password.png";
import axios from "axios";

const LoginSignUp = () => {
  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  // Handle Signup/Login
  const handleSubmit = async () => {
    try {
      if (action === "Sign Up") {
        const res = await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            name,
            email,
            password,
          }
        );
        setMessage(res.data.msg);
      } else {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });
        localStorage.setItem("token", res.data.token); // JWT save
        setMessage(`Welcome ${res.data.user.name}`);
      }
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.msg || "Something went wrong");
      } else {
        setMessage("Server not responding");
      }
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      <div className="inputs">
        {action === "Login" ? (
          <></>
        ) : (
          <div className="input">
            <img src={user_icon} alt="" />
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="input">
          <img src={email_icon} alt="" />
          <input
            type="email"
            placeholder="Enter E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input">
          <img src={password_icon} alt="" />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* 👇 Show/Hide toggle */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "12px",
              color: "blue",
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
      </div>

      {action === "Sign Up" ? null : (
        <div className="forgot-password">
          Forgot Password? <span>Click Here!</span>
        </div>
      )}

      {/* Show success/error message */}
      {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}

      <div className="submit-container">
        <div className="submit" onClick={handleSubmit}>
          {action}
        </div>
        <div
          className="submit gray"
          onClick={() => {
            setAction(action === "Sign Up" ? "Login" : "Sign Up");
            setMessage("");
          }}
        >
          Switch to {action === "Sign Up" ? "Login" : "Sign Up"}
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
