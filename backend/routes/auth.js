import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const router = express.Router();

// Configure mailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Step 1: Send OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 min expiry
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
    });

    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Step 2: Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, resetOTP: otp });

    if (!user) return res.status(400).json({ msg: "Invalid OTP" });
    if (user.resetOTPExpiry < Date.now())
      return res.status(400).json({ msg: "OTP expired" });

    res.json({ msg: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Step 3: Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email, resetOTP: otp });

    if (!user) return res.status(400).json({ msg: "Invalid request" });
    if (user.resetOTPExpiry < Date.now())
      return res.status(400).json({ msg: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOTP = null;
    user.resetOTPExpiry = null;
    await user.save();

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
