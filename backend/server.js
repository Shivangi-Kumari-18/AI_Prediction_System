import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import notifyRoutes from "./routes/notify.js";
import mentorNotifyRoutes from "./routes/mentorNotify.js";
import studentRoutes from "./routes/StudentRoutes.js"; // Import student routes 
import mentorRoutes from './routes/mentorRoutes.js';
import attendanceRoutes from "./routes/attendanceRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notifyCounsellor from "./routes/notifyCounsellor.js";
import dashstudentRoutes from "./routes/dashstudentRoutes.js";
import roleAuthRouter from "./routes/roleAuth.js";
import studentProfileRoutes from "./routes/studentProfile.js";
import mentorProfileRoutes from "./routes/mentorProfile.js";
import quizRoutes from "./routes/QuizRoutes.js";

import notesRouter from "./routes/notes.js";
import leaveRoutes from "./routes/leaveRoutes.js";



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notify", notifyRoutes);
app.use("/api/mentor-notify", mentorNotifyRoutes);
app.use("/api/students", studentRoutes); 
app.use('/api/mentors', mentorRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/notifycounsellor", notifyCounsellor);
app.use("/students", dashstudentRoutes);
app.use("/api/role-auth", roleAuthRouter);
app.use("/api/student-profile", studentProfileRoutes);
app.use("/api/mentor-profile", mentorProfileRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/notes", notesRouter);


// MongoDB connection with FrontendDb
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () =>
      console.log(
        `✅ Server running on port ${process.env.PORT}, DB: FrontendDb`
      )
    );
  })
  .catch((err) => console.log("❌ MongoDB connection error:", err));
