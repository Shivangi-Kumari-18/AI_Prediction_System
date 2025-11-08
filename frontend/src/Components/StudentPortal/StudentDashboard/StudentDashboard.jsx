import React, { useState, useEffect } from "react";
import "./StudentDashboard.css";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { FaUserGraduate } from "react-icons/fa";
import FeePayment from "../FeePayment/FeePayment";
import Attendance from "../Attendance/Attendance";
import LeaveForm from "../LeaveForm/LeaveForm";
import StudentNotifications from "../StudentNotification/StudentNotifications";
import axios from "axios";

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/student-profile/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudent(res.data);
      } catch (err) {
        console.error("❌ Error fetching student profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, []);

  const attendanceData = [
    { name: "Present", value: 80 },
    { name: "Absent", value: 20 },
  ];
  const testScores = [
    { subject: "Math", score: 85 },
    { subject: "Physics", score: 78 },
    { subject: "Chemistry", score: 92 },
    { subject: "CS", score: 88 },
    { subject: "English", score: 74 },
  ];

  const COLORS = ["#4CAF50", "#E74C3C"];

  const notifications = [
    "Your next fee installment is due on 30th Sept",
    "Assignment submission deadline is 25th Sept",
    "Sports meet registration closes tomorrow",
  ];

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!student) {
    return <p>No student profile found.</p>;
  }

  return (
    <div className="student-dashboard">
      <div className="student-container">
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
              Fee Payment
            </button>
            <button
              className={`nav-btn ${
                activeTab === "attendance" ? "active" : ""
              }`}
              onClick={() => setActiveTab("attendance")}
            >
              View Attendance
            </button>
            <button
              className={`nav-btn ${activeTab === "leave" ? "active" : ""}`}
              onClick={() => setActiveTab("leave")}
            >
              Apply For Leave
            </button>
            <button
              className={`nav-btn ${
                activeTab === "notification" ? "active" : ""
              }`}
              onClick={() => setActiveTab("notification")}
            >
              Notification
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="content">
          {activeTab === "dashboard" && (
            <>
              <div className="welcome-banner">
                <div className="welcome-text">
                  <h2>Welcome, {student?.studentName || "Student"}!</h2>
                  <p>Glad to see you back 🎉</p>
                </div>
                <FaUserGraduate className="welcome-icon" />
              </div>

              {/* Student Info */}
              <div className="student-info">
                <img
                  src="https://via.placeholder.com/80"
                  alt="Student Avatar"
                  className="student-avatar"
                />
                <div className="student-detail">
                  <h3>Student Information</h3>

                  <div className="student-meta">
                    <p>
                      <strong>ID:</strong> {student?.studentId}
                    </p>
                    <p>
                      <strong>Course:</strong> {student?.course}
                    </p>
                    <p>
                      <strong>Year:</strong> {student?.year}
                    </p>
                    <p><strong>Mentor Assigned:</strong> {student.assignedMentorId
    ? `${student.assignedMentorId.firstName} ${student.assignedMentorId.lastName}`
    : "Not Assigned"}</p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="cards">
                <div className="card">Attendance: 80%</div>
                <div className="card"> Fees: {student.tuitionFeesUpToDate === "Yes" ? "Up-to-date" : "Pending"}
    {student.totalFees && student.paidFees !== undefined && (
      <span>
        {" "}
        ({student.paidFees} / {student.totalFees})
      </span>
    )}
    {student.dueDate && student.tuitionFeesUpToDate !== "Yes" && (
      <span> - Due by {student.dueDate}</span>
    )} </div>
                <div className="card">Dropout Risk: Low</div>
              </div>

              {/* Charts */}
              <div className="charts-row">
                <div className="chart-container">
                  <h3>Attendance Overview</h3>
                  <PieChart width={300} height={250}>
                    <Pie
                      data={attendanceData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>

                <div className="chart-container">
                  <h3>Test Scores</h3>
                  <BarChart width={400} height={250} data={testScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="score" fill="#3498db" />
                  </BarChart>
                </div>
              </div>
            </>
          )}

          {activeTab === "fees" && <FeePayment />}
          {activeTab === "attendance" && <Attendance />}
          {activeTab === "leave" && <LeaveForm studentId={student._id} />}
          {activeTab === "notification" && <StudentNotifications/>}
        </main>
      </div>
    </div>
  );
}




// import React, { useState,useEffect } from "react";
// import "./StudentDashboard.css";
// import { PieChart, Pie, Cell, Tooltip, Legend,BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
// import { FaUserGraduate } from "react-icons/fa";
// import FeePayment from "../FeePayment/FeePayment";
// import Attendance from "../Attendance/Attendance";
// import LeaveForm from "../LeaveForm/LeaveForm";
// import axios from "axios";





// export default function StudentDashboard() {
//   const [activeTab, setActiveTab] = useState("dashboard");

//   // Dummy student data
//   const [student, setStudent] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//   const fetchStudent = async () => {
//     try {
//       const token = localStorage.getItem("token"); // login ke baad token save hoga
//       const res = await axios.get("http://localhost:5000/api/student-profile/profile", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setStudent(res.data);
//     } catch (err) {
//       console.error("❌ Error fetching student profile:", err);
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchStudent();
// }, []);



//   const attendanceData = [
//     { name: "Present", value: 80 },
//     { name: "Absent", value: 20 },
//   ];
//   const testScores = [
//     { subject: "Math", score: 85 },
//     { subject: "Physics", score: 78 },
//     { subject: "Chemistry", score: 92 },
//     { subject: "CS", score: 88 },
//     { subject: "English", score: 74 },
//   ];

  

//   const COLORS = ["#4CAF50", "#E74C3C"];

//   const notifications = [
//     "Your next fee installment is due on 30th Sept",
//     "Assignment submission deadline is 25th Sept",
//     "Sports meet registration closes tomorrow",
//   ];

//   return (
//     <div className="student-dashboard">
//       <div className="student-container">
//         {/* Sidebar */}
//         <aside className="sidebar">
//           <nav>
//             <button
//               className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
//               onClick={() => setActiveTab("dashboard")}
//             >
//               Dashboard
//             </button>
//             <button
//               className={`nav-btn ${activeTab === "fees" ? "active" : ""}`}
//               onClick={() => setActiveTab("fees")}
//             >
//               Fee Payment
//             </button>
//             <button
//               className={`nav-btn ${
//                 activeTab === "attendance" ? "active" : ""
//               }`}
//               onClick={() => setActiveTab("attendance")}
//             >
//               View Attendance
//             </button>
//             <button
//               className={`nav-btn ${activeTab === "leave" ? "active" : ""}`}
//               onClick={() => setActiveTab("leave")}
//             >
//               Apply For Leave
//             </button>
//             <button
//               className={`nav-btn ${
//                 activeTab === "notification" ? "active" : ""
//               }`}
//               onClick={() => setActiveTab("notification")}
//             >
//               Notification
//             </button>
//           </nav>
//         </aside>

//         {/* Content Area */}
//         <main className="content">
//           {activeTab === "dashboard" && (
//             <>
//               <div className="welcome-banner">
//                 <div className="welcome-text">
//                   <h2>Welcome, {student.studentName}!</h2>
//                   <p>Glad to see you back 🎉</p>
//                 </div>
//                 <FaUserGraduate className="welcome-icon" />
//               </div>

//               {/* Student Info */}
//               <div className="student-info">
//                 <img
//                   src="https://via.placeholder.com/80"
//                   alt="Student Avatar"
//                   className="student-avatar"
//                 />
//                 <div className="student-detail">
//                   <h3>Student Information</h3>

//                   <div className="student-meta">
//                     <p><strong>ID:</strong> {student.studentId}</p>
//                     <p><strong>Course:</strong> {student.course}</p>
//                     <p><strong>Year:</strong> {student.year}</p>
//                   </div>
//                 </div>
//               </div>


//               {/* Quick Stats */}
//               <div className="cards">
//                 <div className="card">Attendance: 80%</div>
//                 <div className="card">Fees: Up-to-date</div>
//                 <div className="card">Dropout Risk: Low</div>
//               </div>

//               {/* Attendance Chart */}
//             <div className="charts-row">
//               <div className="chart-container">
//                 <h3>Attendance Overview</h3>
//                 <PieChart width={300} height={250}>
//                   <Pie
//                     data={attendanceData}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={80}
//                     label
//                   >
//                     {attendanceData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                   <Legend />
//                 </PieChart>
//               </div>
//               {/* Test Scores Graph */}
//               <div className="chart-container">
//                 <h3>Test Scores</h3>
//                 <BarChart width={400} height={250} data={testScores}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="subject" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="score" fill="#3498db" />
//                 </BarChart>
//               </div>

//               {/* Notifications */}
//             </div>  
//             </>
//           )}

//           {activeTab === "fees" && <FeePayment />}
//           {activeTab === "attendance" && <Attendance />}
//           {activeTab === "leave" && <LeaveForm />}

//           {activeTab === "notification" && <h2>All Notifications</h2>}
//         </main>
//       </div>
//     </div>
//   );
// }




