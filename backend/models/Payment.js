import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  mode: { type: String, required: true },
  remarks: { type: String },
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);
