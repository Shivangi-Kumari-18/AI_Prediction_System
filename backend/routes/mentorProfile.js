// import express from "express";
// import Mentor from "../models/Mentor.js";
// import { verifyToken } from "../middleware/verifyToken.js";

// const router = express.Router();

// // 🟢 Get logged-in mentor profile
// router.get("/profile", verifyToken, async (req, res) => {
//   try {
//     if (req.user.role !== "mentor") {
//       return res.status(403).json({ msg: "Access denied" });
//     }

//     const mentor = await Mentor.findById(req.user.id).populate(
//       "assignedStudents",
//       "studentName studentId email course year"
//     );

//     if (!mentor) return res.status(404).json({ msg: "Mentor not found" });

//     res.json(mentor);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// export default router;

import express from "express";
import Student from "../models/Student.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Get all students assigned to the logged-in mentor
router.get("/assigned-students", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "mentor") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const students = await Student.find({ assignedMentorId: req.user.id })
      .select(
        "studentName studentId email course year attendance testScore"
      ); // only needed fields

    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;

