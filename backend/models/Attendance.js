// backend/models/Attendance.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  name: { type: String, required: true },
  course: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Present", "Absent", "Leave", "Not Marked"], 
    default: "Not Marked" 
  },
  date: { type: String, required: true } // YYYY-MM-DD
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;

