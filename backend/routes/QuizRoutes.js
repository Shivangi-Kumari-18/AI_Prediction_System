import express from "express";
import Quiz from "../models/Quiz.js";
import QuizResponse from "../models/QuizResponse.js";

const router = express.Router();

// ✅ Create Quiz (Mentor)
router.post("/create", async (req, res) => {
  try {
    const { title, questions, mentorId, expiresAt } = req.body;
    const quiz = new Quiz({
      title,
      questions,
      createdBy: mentorId,
      expiresAt,
    });
    await quiz.save();
    res.json({ message: "Quiz created", quiz });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Submit Quiz (Student)
router.post("/submit/:quizId", async (req, res) => {
  try {
    const { studentId, answers } = req.body;
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (q.correctAnswer === answers[i]) score++;
    });

    const response = new QuizResponse({
      quizId: quiz._id,
      studentId,
      answers,
      score,
    });

    await response.save();

    res.json({ message: "Submitted", score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Quiz Responses (Mentor)
router.get("/responses/:quizId", async (req, res) => {
  try {
    const responses = await QuizResponse.find({ quizId: req.params.quizId });
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
