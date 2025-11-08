
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Counsellor.css";
import axios from "axios";

const Counsellor = ({ students ,goBack }) => {


  // Initialize state with students
  const [updatedStudents, setUpdatedStudents] = useState(
    students.map((s) => ({
      ...s,
      session: s.session || null,
      status: s.status || "Pending",
    }))
  );

  // Update session date
  const handleDateChange = (id, date) => {
    setUpdatedStudents((prev) =>
      prev.map((s) => (s.student_id === id ? { ...s, session: date } : s))
    );
  };

  // Update status
  const handleStatusChange = (id, value) => {
    setUpdatedStudents((prev) =>
      prev.map((s) => (s.student_id === id ? { ...s, status: value } : s))
    );
  };

  // Notify student (future backend integration)
  const notifyStudent = async (student) => {
    if (!student.session) {
      alert("Please select a session date first!");
      return;
    }

    // const readableDate = new Date(student.session).toLocaleDateString("en-GB", {
    //   day: "2-digit",
    //   month: "short",
    //   year: "numeric",
    // });
      const readableDate = new Date(student.session).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // 12-hour format
      });

    // Manual / Generated Meet link
    const meetLink =
      student.meet_link || "https://meet.google.com/ncc-psaz-wki";

    try {
      const token = localStorage.getItem("token"); 
      const res = await axios.post(
        "http://127.0.0.1:5000/api/notify", // ⬅️ ab Node.js pe jaayega
        {
          email: student.email,
          name: student.name,
          session_date: readableDate,
          meet_link: meetLink,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ⬅️ Yahi missing tha: UI state update karo
      setUpdatedStudents((prev) =>
        prev.map((s) =>
          s.student_id === student.student_id
            ? { ...s, meet_link: meetLink }
            : s
        )
      );

      alert(res.data.msg || "Student notified");
      console.log(res.data);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.msg || "Failed to notify student");
    }
  };

  // Function to mark student for counselling (can be called from Student.jsx)
  const markForCounselling = async (student) => {
    try {
      setUpdatedStudents((prev) => {
        const exists = prev.find((s) => s.student_id === student.student_id);

        if (exists) {
          // Agar student already list me hai → update karo
          return prev.map((s) =>
            s.student_id === student.student_id
              ? { ...s, status: "Pending", session: null, meet_link: meetLink }
              : s
          );
        } else {
          // Agar student nahi hai → add karo
          return [
            ...prev,
            {
              ...student,
              status: "Pending",
              session: null,
              meet_link: meetLink,
            },
          ];
        }
      });

      // API call example (agar res ka use karna hai to pehle call karo)
      // const res = await axios.post("/api/notify", { student, meetLink });

      alert("Student notified successfully");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.msg || "Failed to notify student");
    }
  };

  // Only show students with Pending, Ongoing, or Counselling status
  const counsellingStudents = updatedStudents.filter(
    (s) =>
      s.status === "Pending" ||
      s.status === "Ongoing" ||
      s.status === "Counselling"
  );
  
  


  return (
    <section className="counselling-page">
      <div className="content-wrapper">
      {/* Hero Section */}
      {/* Back Button */}
        <button className="back-btn" onClick={goBack} style={{ marginBottom: "20px" }}>
          ⬅ Back
        </button>
      <div className="counsellor-hero">{/* For Image  */}</div>
      {/* Main Card */}
      <div className="full-card">
        <div className="card-header">
          <h2>Counseling</h2>
          <p>Manage counselling sessions, mentors, status and notifications.</p>
        </div>

        <div className="counsel-list">
          <table className="counsel-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Studentt Name</th>
                <th>Session Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {counsellingStudents.map((s, i) => (
                <tr key={i}>
                    <td>{s.student_id}</td>

                  <td>{s.name}</td>
                  {/* Date picker */}
                  <td>
                    <DatePicker
                      selected={s.session ? new Date(s.session) : null}
                      onChange={(date) => handleDateChange(s.student_id, date)}
                      dateFormat="dd/MM/yyyy h:mm aa"
                      placeholderText="Select Date & Time"
                      className="date-input"
                      showPopperArrow={false}
                      isClearable
                      showTimeSelect                   // time picker enable karega
                        timeIntervals={15}               // time selection interval in minutes
                        timeCaption="Time"  
                    />
                  </td>

                  {/* Status dropdown */}
                  <td>
                    <select
                      value={s.status}
                      onChange={(e) =>
                        handleStatusChange(s.student_id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>

                  {/* Notify button */}
                  <td>
                    <button
                      className="small-btn"
                      onClick={() => notifyStudent(s)}
                    >
                      Notify
                    </button>
                    {s.meet_link && (
                      <a
                        href={s.meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="small-btn join-btn"
                        style={{
                          marginLeft: "8px",
                          background: "#22c55e",
                          textDecoration: "none",
                          marginBottom: "4px",
                        }}
                      >
                        Join
                      </a>
                    )}
                  </td>
                </tr>
              ))}
              {counsellingStudents.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No students marked for counselling
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Suggestions Section */}
        <div className="suggestion-section">
          <h3>Suggestions & Solutions</h3>
          <div className="suggestion-cards">
            <div className="s-card">
              <img
                src="financial.jpg"
                alt="Financial Strain"
                className="s-card-icon"
              />
              <h4>Financial Strain</h4>
              <p>
                Offer scholarships, fee waivers, and part-time opportunities.
              </p>
            </div>
            <div className="s-card">
              <img
                src="study.jpg"
                alt="Academic Struggles"
                className="s-card-icon"
              />
              <h4>Academic Struggles</h4>
              <p>
                Provide career counseling, tutoring, and mentorship programs.
              </p>
            </div>
            <div className="s-card">
              <img
                src="stress.jpg"
                alt="Mental Health"
                className="s-card-icon"
              />
              <h4>Mental Health</h4>
              <p>
                Encourage peer support groups, therapy sessions, and wellness
                activities.
              </p>
            </div>
            <div className="s-card">
              <img
                src="career_guidance.jpg"
                alt="Career Guidance"
                className="s-card-icon"
              />
              <h4>Career Guidance</h4>
              <p>
                Encourage peer support groups, therapy sessions, and wellness
                activities.
              </p>
            </div>

            <div className="s-card">
              <img
                src="personalissue.jpg"
                alt="Personal Issue"
                className="s-card-icon"
              />
              <h4>Personal Issue Counselling</h4>
              <p>
                Encourage peer support groups, therapy sessions, and wellness
                activities.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>

    </section>
  );
};

export default Counsellor;

