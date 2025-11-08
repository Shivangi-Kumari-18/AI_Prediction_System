// import express from "express";
// import nodemailer from "nodemailer";
// import jwt from "jsonwebtoken";
// import Notification from "../models/Notification.js";
// const router = express.Router();

// // Middleware to verify JWT
// const verifyToken = (req, res, next) => {
//   //   const authHeader = req.headers["authorization"];
//   //   console.log("Authorization Header:", authHeader);
//   const token = req.headers["authorization"]?.split(" ")[1];
//   if (!token) return res.status(401).json({ msg: "No token provided ❌" });

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(401).json({ msg: "Invalid token ❌" });
//     req.user = decoded; // decoded payload {id, email}
//     next();
//   });
// };

// // Notify Student (send counselling session email)
// router.post("/", verifyToken, async (req, res) => {
//   try {
//     const { email, name, session_date } = req.body;

//     if (!email || !name || !session_date) {
//       return res.status(400).json({ msg: "Missing fields ❌" });
//     }

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER, // apna Gmail dal
//         pass: process.env.EMAIL_PASS, // App password dal
//       },
//     });

//     const mailOptions = {
//       from: `"Counselling Team" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "📅 Counselling Session Notification",
//       html: `
//     <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height:1.6; color:#333; max-width:650px; margin:30px auto; border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08); overflow:hidden;">
      
//       <!-- Header -->
//       <div style="background: linear-gradient(135deg, #4f46e5, #6366f1); padding:25px; color:#fff; text-align:center;">
//         <h2 style="margin:0; font-size:22px; letter-spacing:0.5px;">Counselling Session Scheduled</h2>
//       </div>
      
//       <!-- Body -->
//       <div style="padding:25px;">
//         <p style="font-size:16px; margin-bottom:10px;">Hi <b>${name}</b>,</p>
        
//         <p style="font-size:15px; color:#444;">
//           We are pleased to inform you that your counselling session has been scheduled. 
//           Please find the details below:
//         </p>
        
//         <div style="margin:20px 0; padding:15px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; text-align:center;">
//           <h3 style="margin:0; color:#4f46e5; font-size:20px;">${session_date}</h3>
//         </div>
        
//         <p style="font-size:15px; color:#444;">
//           Kindly ensure to attend on time. If you have any queries, feel free to reach out to us.
//         </p>
        
//         <p style="margin-top:25px; font-size:15px;">
//           Best regards,<br/>
//           <b style="color:#4f46e5;">Counselling Team</b>
//         </p>
//       </div>
      
//       <!-- Footer -->
//       <div style="background:#f3f4f6; padding:15px; text-align:center; font-size:13px; color:#777;">
//         <p style="margin:0;">© ${new Date().getFullYear()} AI Prediction System | All Rights Reserved</p>
//       </div>
//     </div>
//   `,
//     };

//     const info = await transporter.sendMail(mailOptions);

//     res.json({
//       success: true,
//       msg: `✅ Email sent successfully to ${email}`,
//       info,
//     });
//   } catch (err) {
//     console.error("Email error:", err);
//     res.status(500).json({ msg: "Failed to send email ❌" });
//   }
// });

// export default router;

import express from "express";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import Notification from "../models/Notification.js";
const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  //   const authHeader = req.headers["authorization"];
  //   console.log("Authorization Header:", authHeader);
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token provided ❌" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Invalid token ❌" });
    req.user = decoded; // decoded payload {id, email}
    next();
  });
};

// Notify Student (send counselling session email)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { email, name, session_date, meet_link } = req.body;

    if (!email || !name || !session_date || !meet_link) {
      return res.status(400).json({ msg: "Missing fields ❌" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // apna Gmail dal
        pass: process.env.EMAIL_PASS, // App password dal
      },
    });

    const mailOptions = {
      // from: "Counselling Team" <${process.env.EMAIL_USER}>,
      from: `"Counselling Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "📅 Counselling Session Notification",
      html: `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height:1.6; color:#333; max-width:650px; margin:30px auto; border:1px solid #e5e7eb; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08); overflow:hidden;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #4f46e5, #6366f1); padding:25px; color:#fff; text-align:center;">
        <h2 style="margin:0; font-size:22px; letter-spacing:0.5px;">Counselling Session Scheduled</h2>
      </div>
      
      <!-- Body -->
      <div style="padding:25px;">
        <p style="font-size:16px; margin-bottom:10px;">Hi <b>${name}</b>,</p>
        
        <p style="font-size:15px; color:#444;">
          We are pleased to inform you that your counselling session has been scheduled. 
          Please find the details below:
        </p>
        
        <div style="margin:20px 0; padding:15px; background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; text-align:center;">
          <h3 style="margin:0; color:#4f46e5; font-size:20px;">${session_date}</h3>
          <p>Please join using the link below:</p>
      <a href="${meet_link}" target="_blank" 
         style="display:inline-block; padding:10px 20px; background:#4f46e5; color:white; border-radius:6px; text-decoration:none;">
         Join Google Meet
      </a>
        </div>
        
        <p style="font-size:15px; color:#444;">
          Kindly ensure to attend on time. If you have any queries, feel free to reach out to us.
        </p>
        
        <p style="margin-top:25px; font-size:15px;">
          Best regards,<br/>
          <b style="color:#4f46e5;">Counselling Team</b>
        </p>
      </div>
      
      <!-- Footer -->
      <div style="background:#f3f4f6; padding:15px; text-align:center; font-size:13px; color:#777;">
        <p style="margin:0;">© ${new Date().getFullYear()} AI Prediction System | All Rights Reserved</p>
      </div>
    </div>
  `,
    };

    const info = await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      // msg: ✅ Email sent successfully to ${email},
       msg: `✅ Email sent successfully to ${email}`,
      info,
    });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ msg: "Failed to send email ❌" });
  }
});

export default router;