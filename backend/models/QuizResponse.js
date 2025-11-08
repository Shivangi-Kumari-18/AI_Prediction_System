import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  quizId: String,
  studentId: String,
  answers: [Number],
  score: Number,
  submittedAt: { type: Date, default: Date.now },
});

const QuizResponse = mongoose.model("QuizResponse", responseSchema);
export default QuizResponse;
