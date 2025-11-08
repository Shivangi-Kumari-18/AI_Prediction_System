import express from "express";
import Payment from "../models/Payment.js";
import Student from "../models/Student.js";

const router = express.Router();

// POST - Add Payment
router.post("/", async (req, res) => {
  try {
    const { studentId, amount, date, mode, remarks } = req.body;

    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ error: "Student not found" });

    // Update student's paidFees
    student.paidFees = (student.paidFees || 0) + Number(amount);

    // Update tuition fee status
  student.tuitionFeesUpToDate =
  student.paidFees >= student.totalFees ? "Yes" : "No";
    await student.save();

    // Save payment record
    const payment = new Payment({ studentId, amount, date, mode, remarks });
    await payment.save();

    res.json({ msg: "Payment recorded successfully", payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to record payment" });
  }
});

// GET - Fetch Payment History
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch payments" });
  }
});

export default router;
