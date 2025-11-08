
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LoginOptions.css";
import AdminLogin from "./AdminLogin";
import MentorLogin from "./MentorLogin";
import StudentLogin from "./StudentLogin";

export default function LoginOptions() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [mentorId, setMentorId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { role: selectedRole, password };

      if (selectedRole === "admin") payload.email = email;
      if (selectedRole === "mentor") payload.mentorId = mentorId;
      if (selectedRole === "student") payload.studentId = studentId;

      // const res = await axios.post("/api/auth/login", payload);
      const res = await axios.post("http://localhost:5000/api/role-auth/login", payload);

      // Save token & role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", selectedRole);

      // Navigate to respective dashboard
      if (selectedRole === "admin") navigate("/admin");
      if (selectedRole === "mentor") navigate("/dashboard");
      if (selectedRole === "student") navigate("/studentportal");

    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
<div className="login-options">
      <h2>Select Your Login</h2>

      {/* Role Buttons */}
      {!selectedRole && (
        <div className="login-boxes">
          <div className="login-box admin">
            <h3>🛠 Admin Login</h3>
            <p>Access system settings and manage everything.</p>
            <button className="btn-primary" onClick={() => setSelectedRole("admin")}>
              Login Here
            </button>
          </div>
          <div className="login-box mentor">
            <h3>👨‍🏫 Mentor / Teacher Login</h3>
            <p>Access student data, monitor risks, and give counseling.</p>
            <button className="btn-primary" onClick={() => setSelectedRole("mentor")}>
              Login Here
            </button>
          </div>
          <div className="login-box student">
            <h3>🎓 Student Login</h3>
            <p>View your details.</p>
            <button className="btn-primary" onClick={() => setSelectedRole("student")}>
              Login Here
            </button>
          </div>
        </div>
      )}

      {/* Role-based Login Form */}
      {selectedRole && (
        <div className="login-form">
          {/* <h3>{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login</h3> */}
          <form onSubmit={handleSubmit}>
            {/* {selectedRole === "admin" && (
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )} */}
                  {selectedRole === "admin" && (
        <AdminLogin email={email} setEmail={setEmail} password={password} setPassword={setPassword} />
      )}
            {/* {selectedRole === "mentor" && (
              <input
                type="text"
                placeholder="Mentor ID"
                value={mentorId}
                onChange={(e) => setMentorId(e.target.value)}
                required
              />
            )} */}
                  {selectedRole === "mentor" && (
        <MentorLogin  mentorId={mentorId} setMentorId={setMentorId} password={password} setPassword={setPassword} />
      )}
            {selectedRole === "student" && (
        <StudentLogin  studentId={studentId} setStudentId={setStudentId} password={password} setPassword={setPassword} />
      )}
            {/* {selectedRole === "student" && (
              <input
                type="text"
                placeholder="Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            )} */}
            {/* <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            /> */}
            <button type="submit" className="btn-primary">Login</button>
          </form>

          <button
            className="btn-secondary"
            onClick={() => setSelectedRole("")}
            style={{ marginTop: "10px" }}
          >
            ← Back to Role Selection
          </button>
        </div>
      )}
    </div>
  );
}
