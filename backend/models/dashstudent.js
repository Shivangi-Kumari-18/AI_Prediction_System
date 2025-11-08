import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  course: String,
  email: String,
  prediction: Number,
  dropout_probability: Number,
  risk: String,
  explanations: { type: Array, default: [] },
});

const Student = mongoose.models.Student || mongoose.model("Student", studentSchema);
export default Student;
