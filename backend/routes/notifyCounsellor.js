import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Mentor from "../models/Mentor.js";

dotenv.config();
const router = express.Router();

// POST /api/notify
router.post("/", async (req, res) => {
  try {
    const { studentName, studentId, counsellingType, mentorName } = req.body;

    if (!studentName || !studentId || !counsellingType || !mentorName) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    // Find mentor by full name
    const mentor = await Mentor.findOne({
      firstName: mentorName.split(" ")[0],
      lastName: mentorName.split(" ")[1],
    });

    if (!mentor) {
      return res.status(404).json({ msg: "Mentor not found in DB" });
    }

    // Configure transporter (Gmail example)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Compose email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: mentor.email, // dynamic email from DB
      subject: `New Counselling Assigned: ${studentName}`,
      text: `Hello ${mentor.firstName} ${mentor.lastName},

You have a new student assigned for counselling.

Student Name: ${studentName}
Student ID: ${studentId}
Counselling Type: ${counsellingType}

Please schedule the session accordingly.

Regards,
Your Counselling System`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ msg: "Mentor notified successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to notify mentor", error: err });
  }
});

export default router;
