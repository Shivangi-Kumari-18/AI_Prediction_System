


import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mentorId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  specialization: { type: String, required: true },
  qualification: { type: String, required: true },
  counsellingType: { type: String, required: true },
  experience: { type: Number },
  availability: { type: String },
  notes: { type: String },
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },     // hashed password for auth
  plainPassword: { type: String }, // plain password for admin reference
  active: { type: Boolean, default: true },
},{ timestamps: true });

const Mentor = mongoose.model("Mentor", mentorSchema);

export default Mentor;
