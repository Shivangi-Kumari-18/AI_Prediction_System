import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  studentName: String,
  studentId: { type: String, unique: true },
  year: String,
  email: String,
  phoneNumber: String,
  course: String,
  maritalStatus: String,
  applicationMode: String,
  applicationOrder: String,
  daytimeAttendance: String,
  previousQualification: String,
  previousQualificationGrade: String,
  nationality: String,
  motherQualification: String,
  fatherQualification: String,
  motherOccupation: String,
  fatherOccupation: String,
  admissionGrade: String,
  displaced: String,
  educationalSpecialNeeds: String,
  debtor: String,
  tuitionFeesUpToDate: String,
  gender: String,
  scholarshipHolder: String,
  ageAtEnrollment: String,
  international: String,
  curricularUnits1stSemCredited: String,
  curricularUnits1stSemEnrolled: String,
  curricularUnits1stSemEvaluations: String,
  curricularUnits1stSemApproved: String,
  curricularUnits1stSemGrade: String,
  curricularUnits1stSemWithoutEvaluations: String,
  curricularUnits2ndSemCredited: String,
  curricularUnits2ndSemEnrolled: String,
  curricularUnits2ndSemEvaluations: String,
  curricularUnits2ndSemApproved: String,
  curricularUnits2ndSemGrade: String,
  curricularUnits2ndSemWithoutEvaluations: String,
  unemploymentRate: String,
  inflationRate: String,
  GDP: String,

  totalFees: { type: Number, default: 0 },
  paidFees: { type: Number, default: 0 },
  dueDate: { type: String, default: null },

  // ✅ Plain password (no hashing)
  password: {
    type: String,
    required: true,
  },
  plainPassword: { type: String }, 

  assignedMentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", default: null },

  attendance: {
    type: Number,
    default: 0,
  },
  testScore: {
    type: Number,
    default: 0,
  },
  
},
{ timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
export default Student;


