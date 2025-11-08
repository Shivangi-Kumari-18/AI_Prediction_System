import mongoose from "mongoose";

const mentorNotificationSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentId: { type: String, required: true },
  course: { type: String, required: true },
  riskLevel: { type: String, default: "High" },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, default: "sent" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MentorNotification", mentorNotificationSchema);
