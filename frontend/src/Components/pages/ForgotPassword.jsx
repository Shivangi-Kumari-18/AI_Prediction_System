// src/Components/pages/ForgotPassword.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const validateEmail = (mail) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(mail).toLowerCase());

  const handleSendOTP = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setMessage("");
    if (!email) return setMessage("Enter your email ❌");
    if (!validateEmail(email)) return setMessage("Enter a valid email ❌");
    if (!API_URL) return setMessage("API URL not configured (VITE_API_URL) ❌");

    try {
      setIsLoading(true);
      const res = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });
      const data = res?.data || {};
      setMessage(data.msg || "OTP sent ✅");
      setStep(2);
      setResendTimer(60);
    } catch (err) {
      console.error("send OTP error:", err);
      setMessage(
        err?.response?.data?.msg || err?.message || "Error sending OTP ❌"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setMessage("");
    if (!otp) return setMessage("Enter OTP ❌");
    if (!API_URL) return setMessage("API URL not configured (VITE_API_URL) ❌");

    try {
      setIsLoading(true);
      const res = await axios.post(`${API_URL}/auth/verify-otp`, {
        email,
        otp,
      });
      const data = res?.data || {};
      if (data.success) {
        setMessage(data.msg || "OTP verified ✅");
        setStep(3);
      } else {
        setMessage(data.msg || "OTP verification failed ❌");
      }
    } catch (err) {
      console.error("verify OTP error:", err);
      setMessage(
        err?.response?.data?.msg || err?.message || "OTP verification failed ❌"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setMessage("");
    if (!newPassword) return setMessage("Enter new password ❌");
    if (!API_URL) return setMessage("API URL not configured (VITE_API_URL) ❌");

    try {
      setIsLoading(true);
      const res = await axios.post(`${API_URL}/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      const data = res?.data || {};
      try {
        const res = await axios.post(`${API_URL}/auth/reset-password`, {
          email,
          otp,
          newPassword,
        });
        if (res.data.success) {
          navigate("/login", { replace: true }); // redirect immediately
        } else {
          setMessage(res.data.msg || "Reset failed");
        }
      } catch (err) {
        setMessage(err.response?.data?.msg || "Error resetting password");
      }
    } catch (err) {
      console.error("reset password error:", err);
      setMessage(
        err?.response?.data?.msg ||
          err?.message ||
          "Error resetting password ❌"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    await handleSendOTP();
  };

  return (
    <div className="forgot-page">
      <div className="forgot-box">
        <h2>Forgot Password</h2>
        <form
          onSubmit={
            step === 1
              ? handleSendOTP
              : step === 2
              ? handleVerifyOTP
              : handleResetPassword
          }
        >
          {step === 1 && (
            <>
              <input
                type="email"
                placeholder="Enter registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send OTP"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || isLoading}
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}
