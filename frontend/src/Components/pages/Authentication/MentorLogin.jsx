import React from "react";
import { FaChalkboardTeacher, FaUserGraduate, FaLock } from "react-icons/fa";
import "./MentorLogin.css"; // Separate CSS for mentor

export default function MentorLogin({ handleSubmit, mentorId, setMentorId, password, setPassword }) {
  return (
    <div className="mentor-login-container">
      <div className="mentor-card">
        <div className="mentor-header">
          <FaChalkboardTeacher className="mentor-icon" />
          <h2>Mentor Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="mentor-form">
          <div className="input-group">
            <FaUserGraduate className="input-icon" />
            <input
              type="text"
              placeholder="Mentor ID"
              value={mentorId}
              onChange={(e) => setMentorId(e.target.value)}
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

