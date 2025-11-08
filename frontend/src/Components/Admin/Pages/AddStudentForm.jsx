import React, { useState } from "react";
import axios from "axios";
import "./AddStudentForm.css"; // styling alag rakho

const AddStudentForm = ({ onStudentAdded }) => {
  const [studentData, setStudentData] = useState({
    studentName: "",
    // studentId: "",
    year: "",
    email: "",          // added
    phoneNumber: "",  
    course: "",
    maritalStatus: "",
    applicationMode: "",
    applicationOrder: "",
    daytimeAttendance: "",
    previousQualification: "",
    previousQualificationGrade: "",
    nationality: "",
    motherQualification: "",
    fatherQualification: "",
    motherOccupation: "",
    fatherOccupation: "",
    admissionGrade: "",
    displaced: "",
    educationalSpecialNeeds: "",
    debtor: "",
    tuitionFeesUpToDate: "",
    gender: "",
    scholarshipHolder: "",
    ageAtEnrollment: "",
    international: "",
    curricularUnits1stSemCredited: "",
    curricularUnits1stSemEnrolled: "",
    curricularUnits1stSemEvaluations: "",
    curricularUnits1stSemApproved: "",
    curricularUnits1stSemGrade: "",
    curricularUnits1stSemWithoutEvaluations: "",
    curricularUnits2ndSemCredited: "",
    curricularUnits2ndSemEnrolled: "",
    curricularUnits2ndSemEvaluations: "",
    curricularUnits2ndSemApproved: "",
    curricularUnits2ndSemGrade: "",
    curricularUnits2ndSemWithoutEvaluations: "",
    unemploymentRate: "",
    inflationRate: "",
    GDP: "",
    totalFees: 0,
     
  });
const [generatedPassword, setGeneratedPassword] = useState("");

  const handleChange = (e) => {
    setStudentData({...studentData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       const res = await axios.post("http://localhost:5000/api/students", studentData);
       setGeneratedPassword(res.data.generatedPassword);

      alert("✅ Student added successfully!");

      if (onStudentAdded) {
        // onStudentAdded(res.data); // backend se jo data aaye use table/list me bhej do
onStudentAdded({ ...res.data.student, plainPassword: res.data.generatedPassword });
      }



   
      // Reset form
      setStudentData({
        studentName: "",
        // studentId: "",
        year: "",
        email: "",          // added
    phoneNumber: "",  
        course: "",
        maritalStatus: "",
        applicationMode: "",
        applicationOrder: "",
        daytimeAttendance: "",
        previousQualification: "",
        previousQualificationGrade: "",
        nationality: "",
        motherQualification: "",
        fatherQualification: "",
        motherOccupation: "",
        fatherOccupation: "",
        admissionGrade: "",
        displaced: "",
        educationalSpecialNeeds: "",
        debtor: "",
        tuitionFeesUpToDate: "",
        gender: "",
        scholarshipHolder: "",
        ageAtEnrollment: "",
        international: "",
        curricularUnits1stSemCredited: "",
        curricularUnits1stSemEnrolled: "",
        curricularUnits1stSemEvaluations: "",
        curricularUnits1stSemApproved: "",
        curricularUnits1stSemGrade: "",
        curricularUnits1stSemWithoutEvaluations: "",
        curricularUnits2ndSemCredited: "",
        curricularUnits2ndSemEnrolled: "",
        curricularUnits2ndSemEvaluations: "",
        curricularUnits2ndSemApproved: "",
        curricularUnits2ndSemGrade: "",
        curricularUnits2ndSemWithoutEvaluations: "",
        unemploymentRate: "",
        inflationRate: "",
        GDP: "",
        totalFees: 0,
      });
    } catch (err) {
      console.error(err);
      alert("Error adding student");
    }
  };

  return (
    <div className="form-container">
      <h2> Add Student</h2>
      <form onSubmit={handleSubmit}>
        {Object.keys(studentData).map((key) => (
          <input
            key={key}
            type={key === "totalFees" ? "number" : "text"}
            name={key}
            placeholder={key.replace(/([A-Z])/g, ' $1')}
            value={studentData[key]}
            onChange={handleChange}
            required
          />
        ))}
        
        <button type="submit">Add Student</button>
        
      </form>
    </div>
  );
};

export default AddStudentForm;
