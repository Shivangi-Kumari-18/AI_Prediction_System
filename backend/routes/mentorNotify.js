import express from "express";
import nodemailer from "nodemailer";
import MentorNotification from "../models/MentorNotification.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send a single email with all high-risk students
router.post("/send-alert", verifyToken, async (req, res) => {
  try {
    const { students } = req.body; // array of { studentName, studentId, course, risk }

    if (!students?.length) {
      return res
        .status(400)
        .json({ success: false, msg: "No students provided" });
    }

    // Save notifications in DB
    const notifications = await MentorNotification.insertMany(
      students.map((s) => ({
        studentName: s.studentName,
        studentId: s.studentId,
        course: s.course,
        sentBy: req.user.id,
      }))
    );

    // Build HTML table dynamically
    const studentListHtml = students
      .map(
        (s) => `
      <tr>
        <td style="padding:8px; border:1px solid #ddd;">${s.studentName}</td>
        <td style="padding:8px; border:1px solid #ddd;">${s.studentId}</td>
        <td style="padding:8px; border:1px solid #ddd;">${s.course}</td>
        <td style="padding:8px; border:1px solid #ddd;">${s.risk || "High"}</td>
      </tr>`
      )
      .join("");

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.MENTOR_EMAIL,
      subject: `⚠ High Risk Students Alert - AI Prediction System`,
      html: `
  <div style="font-family: 'Arial', sans-serif; line-height:1.6; color:#333; max-width:700px; margin:0 auto; border-radius:10px; overflow:hidden; border:1px solid #e5e7eb;">
    
    <!-- Header -->
    <div style="background: linear-gradient(90deg,#4f46e5,#7c3aed); padding:20px; color:#fff; text-align:center;">
      <h1 style="margin:0; font-size:24px;">AI Prediction System</h1>
      <p style="margin:5px 0 0 0; font-size:14px;">Student Risk Monitoring Dashboard</p>
    </div>

    <!-- Body -->
    <div style="padding:20px; background:#fafafa;">
      <p>Dear Mentor,</p>
      <p>Our AI system has identified the following students as <strong>high-risk</strong> for potential dropout. Please review their profiles and provide timely counselling to support them:</p>
      
      <div style="overflow-x:auto;">
        <table style="border-collapse:collapse; width:100%; min-width:500px; margin-top:15px;">
          <thead>
            <tr style="background-color:#f2f2f2;">
              <th style="padding:10px; border:1px solid #ddd; text-align:left;">Name</th>
              <th style="padding:10px; border:1px solid #ddd; text-align:left;">Student ID</th>
              <th style="padding:10px; border:1px solid #ddd; text-align:left;">Course</th>
              <th style="padding:10px; border:1px solid #ddd; text-align:left;">Risk Level</th>
            </tr>
          </thead>
          <tbody>
            ${students
              .map(
                (s, idx) => `
              <tr style="background-color:${
                idx % 2 === 0 ? "#fff" : "#f9f9f9"
              };">
                <td style="padding:8px; border:1px solid #ddd;">${
                  s.studentName
                }</td>
                <td style="padding:8px; border:1px solid #ddd;">${
                  s.studentId
                }</td>
                <td style="padding:8px; border:1px solid #ddd;">${s.course}</td>
                <td style="padding:8px; border:1px solid #ddd; font-weight:bold; color:${
                  s.risk === "High"
                    ? "#d9534f"
                    : s.risk === "Moderate"
                    ? "#f0ad4e"
                    : "#5cb85c"
                }">${s.risk || "High"}</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <p style="margin-top:20px;">You can view more details and track student progress in your <a href="http://your-dashboard-link.com" style="color:#4f46e5; text-decoration:none;">AI Prediction Dashboard</a>.</p>

      <p style="margin-top:10px; font-size:14px; color:#555;">Note: This is an automated system notification to keep you informed of students requiring attention.</p>
    </div>

    <!-- Footer -->
    <div style="background:#f3f4f6; padding:15px 20px; text-align:center; font-size:12px; color:#666;">
      <p style="margin:0;">© ${new Date().getFullYear()} AI Prediction System. All rights reserved.</p>
      <p style="margin:5px 0 0 0;">If you have questions, please contact <a href="mailto:support@ai-prediction.com" style="color:#4f46e5; text-decoration:none;">support@ai-prediction.com</a></p>
    </div>
  </div>
  `,
    });

    res.json({
      success: true,
      msg: "Alert email sent to mentor",
      notifications,
    });
  } catch (err) {
    console.error("❌ Error sending mentor alert:", err);
    res.status(500).json({ success: false, msg: "Error sending mentor alert" });
  }
});

export default router;
