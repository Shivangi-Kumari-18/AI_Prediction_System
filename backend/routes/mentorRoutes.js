import express from "express";
import Mentor from "../models/Mentor.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const router = express.Router();
let mentorCounter = 1; // server restart hone par reset hoga, DB se sync karna better hai

// const generateMentorId = async () => {
//   // DB me last mentorId check karo
//   const lastMentor = await Mentor.findOne().sort({ createdAt: -1 });
//   if (lastMentor && lastMentor.mentorId) {
//     const lastIdNumber = parseInt(lastMentor.mentorId.replace("MT", ""));
//     mentorCounter = lastIdNumber + 1;
//   }
//   return "MT" + String(mentorCounter).padStart(3, "0");
// };

const generateMentorId = async () => {
  const lastMentor = await Mentor.findOne().sort({ createdAt: -1 });
  let newId = 1;

  if (lastMentor && lastMentor.mentorId) {
    const lastNum = parseInt(lastMentor.mentorId.replace("MT", ""));
    if (!isNaN(lastNum)) {
      newId = lastNum + 1;
    }
  }

  return "MT" + String(newId).padStart(3, "0");
};


// Function to generate random password
const generatePassword = () => crypto.randomBytes(4).toString("hex");

// Add mentor
router.post("/", async (req, res) => {
  try {
    const customMentorId = await generateMentorId(); // ✅ generate MT001 etc
    const randomPassword = generatePassword();
    const generateUserId = () => "MNT" + Math.floor(Math.random() * 10000);
     const hashedPassword = await bcrypt.hash(randomPassword, 10);
    

    const newMentor = new Mentor({
      ...req.body,
      mentorId: customMentorId, // ✅ save custom ID
      userId: generateUserId(),
      password: hashedPassword,       // save hashed password for login
      plainPassword: randomPassword, 
    });

    await newMentor.save();
    res.status(201).json({
      message: "Mentor added successfully",
      mentor: newMentor,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error adding mentor", error });
  }
});

// Get all mentors
router.get("/", async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching mentors", error });
  }
});
// Total mentors count
router.get("/count", async (req, res) => {
  try {
    const totalMentors = await Mentor.countDocuments();
    res.json({ totalMentors });
  } catch (err) {
    res.status(500).json({ message: "Error fetching total mentors", error: err });
  }
});


// Update mentor details
router.put("/:id", async (req, res) => {
  try {
    const { userId, password, ...updateData } = req.body;
    const updatedMentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedMentor);
  } catch (error) {
    res.status(400).json({ message: "Error updating mentor", error });
  }
});

// Toggle Active/Inactive
router.patch("/:id/toggle", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    mentor.active = !mentor.active;
    await mentor.save();
    res.json({ message: "Mentor status updated", mentor });
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
});

// Delete mentor
router.delete("/:id", async (req, res) => {
  try {
    await Mentor.findByIdAndDelete(req.params.id);
    res.json({ message: "Mentor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting mentor", error });
  }
});



export default router;
