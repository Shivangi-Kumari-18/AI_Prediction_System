import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const router = express.Router();

// ✅ Signup (Register)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists ❌" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({
      success: true, // ✅ add this
      msg: "Signup successful ✅",
      user: { name, email },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found ❌" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid credentials ❌" });

    // 🔑 Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // token valid 1 hour
    );

    res.json({
      success: true,
      msg: "Login successful ✅",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Verify Token (ye alag hona chahiye, login ke andar nahi)
router.get("/verify-token", async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, msg: "No token" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, msg: "Invalid token" });
      }
      res.json({ success: true, user: decoded });
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// ✅ Forgot Password (send OTP)
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🔐 Password Reset Request - AI Prediction System",
      html: `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333; max-width:600px; margin:0 auto; border:1px solid #e5e7eb; border-radius:10px; overflow:hidden;">
      
      <!-- Header -->
      <div style="background:linear-gradient(90deg,#4f46e5,#7c3aed); padding:15px 20px; color:#fff; text-align:center;">
        <h2 style="margin:0;">AI Prediction System</h2>
      </div>

      <!-- Body -->
      <div style="padding:20px; background:#fafafa;">
        <p>Dear User,</p>
        <p>We received a request to reset your password. Use the OTP below to proceed:</p>

        <div style="text-align:center; margin:20px 0;">
          <p style="font-size:18px; margin:0;">Your One-Time Password (OTP):</p>
          <p style="font-size:24px; font-weight:bold; color:#4f46e5; margin:5px 0;">${otp}</p>
        </div>

        <p><b>Important Instructions:</b></p>
        <ul style="padding-left:18px; margin:10px 0;">
          <li>This OTP is valid for <b>5 minutes</b> only.</li>
          <li>Do not share this OTP with anyone for your account's safety.</li>
          <li>If you did not request a password reset, please ignore this email.</li>
        </ul>

        <p>You can now return to the application and enter this OTP to continue with resetting your password.</p>

        <p style="margin-top:20px;">Best regards,</p>
        <p style="font-weight:bold; color:#4f46e5;">AI Prediction Team</p>
      </div>

      <!-- Footer -->
      <div style="background:#f3f4f6; padding:12px 20px; text-align:center; font-size:12px; color:#666;">
        <p style="margin:0;">© ${new Date().getFullYear()} AI Prediction System. All rights reserved.</p>
      </div>
    </div>
  `,
    });

    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, resetOTP: otp });

    if (!user) return res.status(400).json({ msg: "Invalid OTP" });
    if (user.resetOTPExpiry < Date.now())
      return res.status(400).json({ msg: "OTP expired" });

    res.json({
      success: true, // ✅ add this
      msg: "Password reset successful ✅",
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// ✅ Reset Password
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
    res.status(500).json({ msg: err.message });
  }
});

export default router;
