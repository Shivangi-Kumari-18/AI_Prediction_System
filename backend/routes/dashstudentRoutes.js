import express from "express";
import Student from "../models/dashstudent.js";
import axios from "axios";

const router = express.Router();

// GET all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ dropout_probability: -1 });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST Excel / records → ML → save
router.post("/upload", async (req, res) => {
  const { records } = req.body;
  if (!records || !Array.isArray(records))
    return res.status(400).json({ error: "No records provided" });

  try {
    // 1️⃣ Call FastAPI ML service
    const mlRes = await axios.post("http://127.0.0.1:8000/predict", {
      records,
    });

    const { results } = mlRes.data;

    // 2️⃣ Merge ML results
    const merged = records.map((rec, idx) => {
      const r = results[idx];
      let risk = "Low";
      if ((r?.dropout_probability ?? 0) >= 70) risk = "High";
      else if ((r?.dropout_probability ?? 0) >= 40) risk = "Moderate";

      return {
        ...rec,
        prediction: r?.prediction ?? 0,
        dropout_probability: r?.dropout_probability ?? 0,
        explanations: r?.explanations ?? [],
        risk,
      };
    });

    // 3️⃣ Save/update to MongoDB
    const ops = merged.map((s) => ({
      updateOne: {
        filter: { student_id: s.student_id },
        update: { $set: {
        student_id: s.student_id,
        name: s.name,
        course: s.course,
        email: s.email,
        prediction: s.prediction,
        dropout_probability: s.dropout_probability,
        risk: s.risk,
        explanations: s.explanations || [],
      }, },
        upsert: true,
      },
    }));
    await Student.bulkWrite(ops);

    const savedStudents = await Student.find().sort({ dropout_probability: -1 });
    res.json(savedStudents);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload or ML service failed" });
  }
});

export default router;
