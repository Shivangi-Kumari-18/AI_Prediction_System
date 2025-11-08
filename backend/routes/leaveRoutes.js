import express from "express";
import Leave from "../models/Leave.js";
import Student from "../models/Student.js";

const router = express.Router();

// Student submits leave
router.post("/", async (req, res) => {
  try {
    const { studentId, leaveType, startDate, endDate, reason } = req.body;

    if (!studentId || !leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const leave = new Leave({
      studentId,
      studentName: student.studentName, // correct field
      leaveType,
      startDate,
      endDate,
      reason,
    });

    await leave.save();
    res.json(leave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all leaves (Admin)
router.get("/", async (req, res) => {
  try {
    const leaves = await Leave.find();
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get leaves for specific student
router.get("/student/:id", async (req, res) => {
  try {
    const leaves = await Leave.find({ studentId: req.params.id });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update leave status (Admin)
router.patch("/:id", async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ error: "Leave not found" });

    const { status } = req.body;
    if (!["Pending", "Approved", "Denied"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    leave.status = status;
    await leave.save();

     req.app.get("io").emit("leaveStatusUpdate", {
      studentId: leave.studentId,
      studentName: leave.studentName,
      status: leave.status,
    });
qq
    res.json(leave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
