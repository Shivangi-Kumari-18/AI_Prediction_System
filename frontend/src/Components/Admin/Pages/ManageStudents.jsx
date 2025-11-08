

import React, { useState, useEffect } from "react";
import "./ManageStudents.css"; // styling alag rakho
import AddStudentForm from "./AddStudentForm"; // Path according to your project
import axios from "axios";

export default function ManageStudents({ isActiveTab }) {
  const [activeSection, setActiveSection] = useState("table");
  const [showAddForm, setShowAddForm] = useState(false);
  const [studentsList, setStudentsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 👈 search term state
  useEffect(() => {
  axios.get("http://localhost:5000/api/students")
    .then(res => setStudents(res.data))
    .catch(err => console.error(err));
}, []);

  useEffect(() => {
    if (!isActiveTab) {
      setActiveSection("table"); // tab inactive → reset section
    }
  }, [isActiveTab]);
  // Dummy data
 const [students, setStudents] = useState([]);


  // Add Student dummy handler
  const handleAddStudent = async() => {
    setActiveSection("addStudent");
    
    // const res = await axios.get("http://localhost:5000/api/students");
    // setStudents(res.data);
    // setActiveSection("table");
  };
  const fetchStudents = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/students");
    setStudents(res.data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchStudents(); // page load par run
}, []);

const handleDeleteStudent = async (id) => {
  if (!window.confirm("Are you sure you want to delete this student?")) return;

  try {
    await axios.delete(`http://localhost:5000/api/students/${id}`);
    // state update
    setStudents((prev) => prev.filter((student) => student._id !== id));
    alert("✅ Student deleted successfully");
  } catch (err) {
    console.error(err);
    alert("❌ Failed to delete student");
  }
};

const handleStudentAdded = (newStudent) => {
  setStudents(prev => [...prev, newStudent]); 
  setActiveSection("table"); // form close karke table dikha do
};
  // ✅ Button ke liye function
  const assignOldMentors = async () => {
    try {
      const res = await axios.put("http://localhost:5000/api/students/assign-old-mentors");
      console.log(res.data);
      alert("✅ Old students updated with mentors!");
      fetchStudents(); // refresh table
    } catch (err) {
      console.error(err);
      alert("❌ Failed to assign mentors");
    }
  };

const filteredStudents = students.filter((student) =>
  student.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  student.course?.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    <div className="manage-students">
      <h2>Student Management</h2>

      {/* Cards Section */}
      <div className="stcards">
        <div className="stcard" onClick={handleAddStudent}>
          <h3>Add Student</h3>
          <p>Add a new student to the system.</p>
        </div>
        <div className="stcard">
          <h3>Manage Students</h3>
          <p>View, edit, or delete student details.</p>
        </div>
      </div>
      {/* {activeSection === "addStudent" && <AddStudentForm />} */}
      {activeSection === "addStudent" && 
        <AddStudentForm onStudentAdded={handleStudentAdded} />
      }
      
      {/* Student Table */}
      {activeSection === "table" && (
      <div className="students-list">
        <div className="students-header">
        <h3>All Students</h3>
        <input
          type="text"
          placeholder="Search by name or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="student-search"
        />
      </div>
                  {/* ✅ Ye button add kiya */}
            <button onClick={assignOldMentors} style={{ marginLeft: "10px" }}>
              Assign Old Students Mentors
            </button>
          
        <table className="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Course</th>
              <th>Year</th>
              <th>email</th>
              <th>Password</th> 
              <th>Assigned Mentor</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.studentId}>
                <td>{student.studentId}</td>
                <td>{student.studentName}</td>
                <td>{student.course}</td>
                <td>{student.year}</td>
                <td>{student.email}</td>
                <td>{student.plainPassword}</td>
                <td>{student.assignedMentorId
    ? `${student.assignedMentorId.firstName} ${student.assignedMentorId.lastName}`
    : "Not Assigned"}</td>
                <td>
                  <button>Edit</button>
                  <button
                    style={{ marginLeft: "8px" }}
                    onClick={() => handleDeleteStudent(student._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      
    </div>
    
  );
}
