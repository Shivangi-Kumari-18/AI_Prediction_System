import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  studentEmail: { type: String, required: true },
  studentName: { type: String },
  sessionDate: { type: String },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  messageId: { type: String },
  status: { type: String, default: "sent" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", NotificationSchema);
