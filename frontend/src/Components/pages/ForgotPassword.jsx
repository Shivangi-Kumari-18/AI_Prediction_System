import React, { useState } from "react";
import axios from "axios";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100">
      <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password
        </h2>
        <div className="mt-6 space-y-4">
          {step === 1 && (
            <>
              <input
                type="email"
                placeholder="Enter registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                onClick={handleSendOTP}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition"
              >
                Send OTP
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
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                onClick={handleVerifyOTP}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition"
              >
                Verify OTP
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button
                onClick={handleResetPassword}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:scale-105 transition"
              >
                Reset Password
              </button>
            </>
          )}
          {message && (
            <p className="text-center text-sm text-red-600">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
