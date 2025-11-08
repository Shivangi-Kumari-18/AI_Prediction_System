import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  title: String,
  createdBy: String, // mentorId
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number, // index of correct option
    },
  ],
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;

