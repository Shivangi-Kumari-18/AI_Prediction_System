import express from "express";
import User from "../models/User.js";
import Mentor from "../models/Mentor.js";
import Student from "../models/Student.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { role, email, mentorId, studentId, password } = req.body;
    let user;

    if(role === "admin") {
      if(!email || !password) return res.status(400).json({ msg: "Email & password required" });
      user = await User.findOne({ email });
      if(!user) return res.status(400).json({ msg: "Admin not found" });
    }

    if(role === "mentor") {
      if(!mentorId || !password) return res.status(400).json({ msg: "Mentor ID & password required" });
      user = await Mentor.findOne({ mentorId });
      if(!user) return res.status(400).json({ msg: "Mentor not found" });
    }

    if(role === "student") {
      if(!studentId || !password) return res.status(400).json({ msg: "Student ID & password required" });
      user = await Student.findOne({ studentId });
      if(!user) return res.status(400).json({ msg: "Student not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // JWT token
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, msg: "Login successful", token, user: { id: user._id, name: user.name || user.firstName, role } });

  } catch(err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
