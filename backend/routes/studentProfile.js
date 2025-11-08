import express from "express";
import Student from "../models/Student.js";
import { verifyToken } from "../middleware/verifyToken.js"; // ye middleware tumhare paas already hai

const router = express.Router();

// 🟢 Get logged-in student profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const student = await Student.findById(req.user.id)
      .populate("assignedMentorId", "firstName lastName email specialization");

    if (!student) return res.status(404).json({ msg: "Student not found" });

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
