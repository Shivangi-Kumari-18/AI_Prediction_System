import React from "react";
import { FaUserGraduate, FaIdBadge, FaLock } from "react-icons/fa";
import "./StudentLogin.css"; // Separate CSS for student

export default function StudentLogin({ handleSubmit, studentId, setStudentId, password, setPassword }) {
  return (
    <div className="student-login-container">
      <div className="student-card">
        <div className="student-header">
          <FaUserGraduate className="student-icon" />
          <h2>Student Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="student-form">
          <div className="input-group">
            <FaIdBadge className="input-icon" />
            <input
              type="text"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

        </form>
      </div>
    </div>
  );
}

