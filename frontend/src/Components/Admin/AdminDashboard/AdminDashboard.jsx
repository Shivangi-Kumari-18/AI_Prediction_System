
import React, { useState,useEffect } from "react";
import "./AdminDashboard.css";
import ManageStudents from "../Pages/ManageStudents"; 
import ManageMentors from "../Pages/ManageMentors";// import your component
import FeeManagement from "../Fee/FeeManagement";
import { FaUserShield } from "react-icons/fa";
import axios from "axios";
import AdminLeaveDashboard from "../Leave/AdminLeaveDashboard";

// import Counselling from "../../Pages/Counselling/Counselling";



export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalMentors, setTotalMentors] = useState(0);
  const highRiskStudents = [
    { id: "STU101", name: "Rohan Verma", course: "B.Tech CSE", probability: 0.92 },
    { id: "STU115", name: "Aditi Sharma", course: "MBA", probability: 0.87 },
    { id: "STU130", name: "Arjun Singh", course: "B.Sc Physics", probability: 0.95 },
  ];
useEffect(() => {
  // Fetch total students
  axios.get("http://localhost:5000/api/students")

    .then(res => {setTotalStudents(res.data)})

    .catch(err => console.error(err));

  // Fetch total mentors
  axios.get("/api/mentors/count")
    .then(res => setTotalMentors(res.data.totalMentors || res.data.length || 0))
    .catch(err => console.error(err));
}, []);



  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <nav>
            <button
              className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`nav-btn ${activeTab === "fees" ? "active" : ""}`}
              onClick={() => setActiveTab("fees")}
            >
              Fee Management
            </button>
            <button
              className={`nav-btn ${activeTab === "mentors" ? "active" : ""}`}
              onClick={() => setActiveTab("mentors")}
            >
              Manage Mentors
            </button>
            <button
              className={`nav-btn ${activeTab === "students" ? "active" : ""}`}
              onClick={() => setActiveTab("students")}
            >
              Manage Students
            </button>
            <button
              className={`nav-btn ${activeTab === "counselling" ? "active" : ""}`}
              onClick={() => setActiveTab("counselling")}
            >
              Counselling
            </button>
             <button
              className={`nav-btn ${activeTab === "leave" ? "active" : ""}`}
              onClick={() => setActiveTab("leave")}
            >
              Leave Management
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="content">
          {activeTab === "dashboard" && (
            <>
               <div className="admin-banner">
                <div className="banner-text">
                  <h2>Welcome, Admin!</h2>
                  <p>Here you can manage the entire system.</p>
                </div>
                <FaUserShield className="banner-icon" />
              </div>
              <div className="acards">
                <div className="acard">Total Students: {students.length}</div>
                <div className="acard">Total Mentors: 41</div>
                <div className="acard">Pending Reports: 8</div>
              </div>

              <div className="high-risk-container">
                <h3>High Risk Students</h3>
                <table className="high-risk-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Course</th>
                      <th>Risk Level</th>
                      <th>Dropout Probability %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {highRiskStudents.map((stu) => (
                      <tr key={stu.id}>
                        <td>{stu.id}</td>
                        <td>{stu.name}</td>
                        <td>{stu.course}</td>
                        <td>
                          <span className="risk-badge high">High</span>
                        </td>
                        <td>{(stu.probability * 100).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Institute Summary Card */}
      <div className="card summary-card">
        <h3>Institute Summary</h3>
        <div className="summary-list">
          <div className="summary-line">
            <span>Total Departments</span>
            <strong>4</strong>
          </div>
          <div className="summary-line">
            <span>Semesters</span>
            <strong>8</strong>
          </div>
          <div className="summary-line">
            <span>Dropout Percentage</span>
            <strong>2%</strong>
          </div>
          <div className="summary-line">
            <span>Quick Filter</span>
            <strong>2</strong>
          </div>
        </div>
      </div>

              
            </>
          )}

          {/* {activeTab === "students" && <ManageStudents />} */}
          {activeTab === "students" && (
            <ManageStudents isActiveTab={activeTab === "students"} />
          )}

          {/* {activeTab === "fees" && <h2>Fee Management Page Coming Soon...</h2>} */}
          {activeTab === "fees" && <FeeManagement />}
          
          {activeTab === "mentors" && <ManageMentors />}
          {activeTab === "counselling" && <h2>Counselling Page Coming Soon...</h2>}
          {activeTab === "leave" && <AdminLeaveDashboard />}
        </main>
      </div>
    </div>
  );
}



