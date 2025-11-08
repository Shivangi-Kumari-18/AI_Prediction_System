// import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import "./StudentDetail.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const COLORS = ["#4caf50", "#ff9800", "#f44336"]; // Green, Orange, Red

const StudentDetail = ({ student, onBack, onMarkForCounselling}) => {
  const [marked, setMarked] = useState(student?.marked || false);

  // useEffect(() => {
  //   // update local marked state if parent prop changes
  //   setMarked(student?.marked || false);
  // }, [student]);
  useEffect(() => {
  // Update marked based on student.status
  if (student?.status === "Completed") {
    setMarked(false); // unmark if counselling completed
  } else {
    setMarked(student?.marked || false);
  }
}, [student?.status, student?.marked]);

  const handleClick = () => {
    // setMarked(true);
    // onMarkForCounselling(student); // parent state update
     if (student?.status !== "Completed") {
    setMarked(true);
    onMarkForCounselling(student);
  }
  };

  const [studentData, setStudentData] = useState(null);

  const fetchStudentDetails = async (studentId) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", {
        records: [{ "Student ID": studentId }], // 👈 Student ka ID
        explain: true, // 👈 Explanations bhi
      });

      const result = response.data.results[0];

      setStudentData({
        ...result,
        explanations: result.explanations ?? [],
      });
    } catch (err) {
      console.error("Error fetching student details:", err);
    }
  };
  useEffect(() => {
    if (student?.["Student ID"]) {
      fetchStudentDetails(student["Student ID"]);
    }
  }, [student]);

  if (!student) return <div>No student selected</div>;

  // Example chart data
  const attendanceData = [
    { date: "Jan 15", value: 85 },
    { date: "Feb 1", value: 90 },
    { date: "Feb 15", value: 88 },
    { date: "Mar 15", value: 95 },
  ];

  const riskData = [
    { name: "Attendance", value: 40 },
    { name: "Fees", value: 30 },
    { name: "Test Scores", value: 30 },
  ];

  const testScores = [
    { name: "Test 1", score: 75 },
    { name: "Test 2", score: 85 },
    { name: "Test 3", score: 92 },
  ];

  const assignments = [
    { name: "Assignment 1", due: "Apr 10", status: "Pending" },
    { name: "Assignment 2", due: "Apr 20", status: "Complete" },
    { name: "Test Scores", due: "May 5", status: "Pending" },
  ];

  return (
    <>
      <button className="back-btn" onClick={onBack}>
        ← Back
      </button>
      <div className="student-details">
        <div className="detail-card student-info">
          <div className="student-photo">
            <img
              src={student.photo || "/default-avatar.png"}
              alt={student.name}
            />
          </div>
          <div className="student-meta">
            <div className="student-main">
              <h2>{student.name || "N/A"}</h2>
              <p className="student-id">{student["Student ID"] || "STU0000"}</p>
            </div>
            <div className="student-extra">
              <p className="course">{student.course || "Course N/A"}</p>
              <p className="semester">Semester 4 - Dept. of IT</p>
            </div>
          </div>
        </div>

        {/* Dropout Risk Pie */}
        <div className="detail-card">
          <h3>Dropout Risk</h3>
          <PieChart width={200} height={200}>
            <Pie
              data={riskData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
              dataKey="value"
            >
              {riskData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
          <p
            style={{ textAlign: "center", fontWeight: "600", fontSize: "18px" }}
          >
            {student.dropout_probability
              ? student.dropout_probability.toFixed(2) + "%"
              : "70%"}
          </p>
        </div>

        {/* Top 3 Dropout Reasons */}
        {studentData?.explanations?.length > 0 && (
          <div className="detail-card">
            <h3>Top Dropout Reasons</h3>
            <ul>
              {studentData.explanations.slice(0, 3).map((exp, idx) => (
                <li key={idx}>
                  <strong>{exp.feature}</strong>:{" "}
                  {(exp.weight * 100).toFixed(1)}%
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Attendance Line Chart */}
        <div className="detail-card">
          <h3>Attendance</h3>
          <LineChart width={300} height={200} data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[80, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#4caf50" />
          </LineChart>
        </div>

        {/* Counseling Info */}
        <div className="detail-card">
          <h3>Counseling Details</h3>
          <p>
            <strong>Mentor:</strong> John Doe
          </p>
          <p>
            <strong>Last Session:</strong> Mar 17
          </p>

          {marked ? (
            <button className="counseling-btn marked">✔ Marked</button>
          ) : (
            <button
              className="counseling-btn"
              // onClick={() => onMarkForCounselling(student)}
              onClick={handleClick}
            >
              Mark for Counselling
            </button>
          )}
        </div>

        {/* Assignments */}
        <div className="detail-card">
          <h3>Assignments</h3>
          <table className="assignments-table">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a, i) => (
                <tr key={i}>
                  <td>{a.name}</td>
                  <td>{a.due}</td>
                  <td
                    className={
                      a.status === "Complete"
                        ? "status-complete"
                        : "status-pending"
                    }
                  >
                    {a.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Test Scores Bar Chart */}
        <div className="detail-card">
          <h3>Test Scores</h3>
          <BarChart width={300} height={200} data={testScores}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#4caf50" />
          </BarChart>
        </div>
      </div>
    </>
  );
};

export default StudentDetail;
