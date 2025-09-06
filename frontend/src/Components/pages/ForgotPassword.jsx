import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOTP = async () => {
    if (!email) return setMessage("Enter your email ❌");
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/forgot-password`,
        { email }
      );
      setMessage("OTP sent ✅");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error sending OTP ❌");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return setMessage("Enter OTP ❌");
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/verify-otp`, {
        email,
        otp,
      });
      setMessage("OTP verified ✅");
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data?.msg || "OTP verification failed ❌");
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword) return setMessage("Enter new password ❌");
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      setMessage("Password reset successful ✅");
      setStep(1);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error resetting password ❌");
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-box">
        <h2>Forgot Password</h2>
        <div className="forgot-form">
          {step === 1 && (
            <>
              <input
                type="email"
                placeholder="Enter registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={handleSendOTP}>Send OTP</button>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <button onClick={handleVerifyOTP}>Verify OTP</button>
            </>
          )}

          {step === 3 && (
            <>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button onClick={handleResetPassword}>Reset Password</button>
            </>
          )}

          {message && <p className="message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
