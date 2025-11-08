

import express from "express";
import Student from "../models/Student.js";
import Mentor from "../models/Mentor.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const router = express.Router();
let studentCounter = 1;

// Round-robin counters for each specialization
let mentorCounters = {}; // { "Math": 0, "Physics": 1, ... }

const generateStudentId = async () => {
  const lastStudent = await Student.findOne().sort({ createdAt: -1 });
  if (lastStudent && lastStudent.studentId) {
    const lastIdNumber = parseInt(lastStudent.studentId.replace("ST", ""));
    studentCounter = lastIdNumber + 1;
  }
  return "ST" + String(studentCounter).padStart(3, "0");
};

const generatePassword = (length = 8) =>
  crypto.randomBytes(length / 2).toString("hex");

// POST - Add Student + Assign Mentor
router.post("/", async (req, res) => {
  try {
    const customId = await generateStudentId();
    const randomPassword = generatePassword(6);

    // === Mentor Assignment Logic ===
    const studentCourse = req.body.course; // course of the student
    const mentors = await Mentor.find({
      specialization: { $regex: new RegExp(studentCourse, "i") },
      active: true,
    });
        console.log("👉 Student Course:", studentCourse);
    console.log("👉 Mentors Found:", mentors);


    let assignedMentor = null;
    if (mentors.length > 0) {
      const lastIndex = mentorCounters[studentCourse] || -1;
      const nextIndex = (lastIndex + 1) % mentors.length;
      assignedMentor = mentors[nextIndex];

      // update counter
      mentorCounters[studentCourse] = nextIndex;
    }
        if (!assignedMentor) {
      return res.status(400).json({
        error: `❌ No mentor available for course: ${studentCourse}`,
      });
    }

        const hashedPassword = await bcrypt.hash(randomPassword, 10);



    const newStudent = new Student({
      ...req.body,
      studentId: customId,
      password: hashedPassword,      // store hashed password
      plainPassword: randomPassword,
      assignedMentorId: assignedMentor ? assignedMentor._id : null, // save mentor ID
    });

    await newStudent.save();

    res.status(201).json({
      message: "✅ Student added successfully",
      student: newStudent,
      generatedPassword: randomPassword,
      assignedMentor: assignedMentor ? `${assignedMentor.firstName} ${assignedMentor.lastName}` : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "❌ Failed to save student" });
  }
});

// GET - Fetch All Students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().populate("assignedMentorId", "firstName lastName");
    const studentsWithPassword = students.map(student => ({
      ...student._doc,
      plainPassword: student.plainPassword, // ya POST me jo random password tha
    }));
    res.json(studentsWithPassword);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

// PUT - Update Attendance
router.put("/:id/attendance", async (req, res) => {
  try {
    const { attendance } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { attendance },
      { new: true }
    );
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to update attendance" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// Total students count
router.get("/count", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    res.json({ totalStudents });
  } catch (err) {
    res.status(500).json({ message: "Error fetching total students", error: err });
  }
});

// PUT - Update Test Score
router.put("/:id/testscore", async (req, res) => {
  try {
    const { testScore } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { testScore },
      { new: true }
    );
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to update test score" });
  }
});
// PUT - Assign mentors to old students without mentors
router.put("/assign-old-mentors", async (req, res) => {
  try {
    const studentsWithoutMentor = await Student.find({ assignedMentorId: null });

    let updatedStudents = [];

    for (const student of studentsWithoutMentor) {
      const mentors = await Mentor.find({
        specialization: { $regex: new RegExp(student.course, "i") },
        active: true,
      });

      if (mentors.length > 0) {
        const lastIndex = mentorCounters[student.course] || -1;
        const nextIndex = (lastIndex + 1) % mentors.length;
        const assignedMentor = mentors[nextIndex];

        mentorCounters[student.course] = nextIndex;

        student.assignedMentorId = assignedMentor._id;
        await student.save();

        updatedStudents.push({
          studentName: student.studentName,
          course: student.course,
          assignedMentor: `${assignedMentor.firstName} ${assignedMentor.lastName}`,
        });
      }
    }

    res.json({
      message: "✅ Old students updated with mentors",
      updatedStudents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "❌ Failed to assign mentors to old students" });
  }
});


export default router;








