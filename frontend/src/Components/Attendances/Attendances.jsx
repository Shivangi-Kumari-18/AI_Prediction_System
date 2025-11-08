
// import React, { useState } from "react";
// import axios from "axios";
// import "./Attendance.css";

// const Attendances = ({ studentData }) => {
//   const [attendance, setAttendance] = useState({});
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]); // default today
//   const [message, setMessage] = useState("");

//   const markAttendance = (id, status) => {
//     setAttendance((prev) => ({
//       ...prev,
//       [id]: status,
//     }));
//   };

//   const saveAttendance = async () => {
//     try {
//       const payload = studentData.map((s) => ({
//         student_id: s.student_id,
//         name: s.name,
//         course: s.course,
//         status: attendance[s.student_id] || "Not Marked",
//         date: selectedDate,
//       }));

//       const response = await axios.post("http://localhost:5000/attendance", payload);
//       console.log(response.data);
//       setMessage("✅ Attendance saved successfully!");
//     } catch (error) {
//       console.error(error);
//       setMessage("❌ Failed to save attendance.");
//     }
//   };

//   return (
//     <div className="attendance-container">
//       <div className="attendance-header">
//         <h2>📌 Student Attendance</h2>
//         <input
//           type="date"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//           className="date-picker"
//         />
//       </div>

//       {studentData.length === 0 ? (
//         <p>No students available. Please upload data first.</p>
//       ) : (
//         <>
//           <table className="attendance-table">
//             <thead>
//               <tr>
//                 <th>Student ID</th>
//                 <th>Name</th>
//                 <th>Course</th>
//                 <th>Mark Attendance</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {studentData.map((s, idx) => (
//                 <tr key={idx}>
//                   <td>{s.student_id || "N/A"}</td>
//                   <td>{s.name}</td>
//                   <td>{s.course}</td>
//                   <td>
//                     <button
//                       className={`att-btn present ${
//                         attendance[s.student_id] === "Present" ? "active" : ""
//                       }`}
//                       onClick={() => markAttendance(s.student_id, "Present")}
//                     >
//                       ✅ Present
//                     </button>
//                     <button
//                       className={`att-btn absent ${
//                         attendance[s.student_id] === "Absent" ? "active" : ""
//                       }`}
//                       onClick={() => markAttendance(s.student_id, "Absent")}
//                     >
//                       ❌ Absent
//                     </button>
//                     <button
//                       className={`att-btn leave ${
//                         attendance[s.student_id] === "Leave" ? "active" : ""
//                       }`}
//                       onClick={() => markAttendance(s.student_id, "Leave")}
//                     >
//                       🟡 Leave
//                     </button>
//                   </td>
//                   <td>
//                     {attendance[s.student_id] ? (
//                       <span
//                         className={`status-badge ${attendance[
//                           s.student_id
//                         ].toLowerCase()}`}
//                       >
//                         {attendance[s.student_id]}
//                       </span>
//                     ) : (
//                       "Not Marked"
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <button className="save-btn" onClick={saveAttendance}>
//             💾 Save Attendance
//           </button>
//           {message && <p className="save-message">{message}</p>}
//         </>
//       )}
//     </div>
//   );
// };

// export default Attendances;





import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Attendance.css";

const Attendances = ({ studentData = [], subjects = [] }) => {
  const [attendance, setAttendance] = useState({});
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSubject, setSelectedSubject] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Filter students based on selected subject
  // const filteredStudents = selectedSubject
  //   ? studentData.filter((s) => s.subject === selectedSubject)
  //   : studentData;
   const filteredStudents = selectedSubject
    ? studentData.filter((s) => s?.subject === selectedSubject)
    : studentData;

  const markAttendance = (id, status) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  const saveAttendance = async () => {
    if (!selectedSubject) {
      alert("⚠️ Please select a subject before saving attendance!");
      return;
    }

    try {
      const payload = filteredStudents.map((s) => ({
        student_id: s.student_id,
        name: s.name,
        course: s.course,
        subject: selectedSubject,
        status: attendance[s.student_id] || "Not Marked",
        date: selectedDate,
      }));

      const response = await axios.post(
        "http://localhost:5000/attendance",
        payload
      );
      console.log(response.data);
      setMessage("✅ Attendance saved successfully!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to save attendance.");
    }
  };

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h2>📌 Student Attendance</h2>

        <div className="attendance-top-controls">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-picker"
          />

          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <p>No students available for this subject.</p>
      ) : (
        <>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>Mark Attendance</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s, idx) => (
                <tr key={idx}>
                  <td>{s.student_id || "N/A"}</td>
                  <td>{s.name}</td>
                  <td>{s.course}</td>
                  <td>
                    <button
                      className={`att-btn present ${
                        attendance[s.student_id] === "Present" ? "active" : ""
                      }`}
                      onClick={() => markAttendance(s.student_id, "Present")}
                    >
                      ✅ Present
                    </button>
                    <button
                      className={`att-btn absent ${
                        attendance[s.student_id] === "Absent" ? "active" : ""
                      }`}
                      onClick={() => markAttendance(s.student_id, "Absent")}
                    >
                      ❌ Absent
                    </button>
                    <button
                      className={`att-btn leave ${
                        attendance[s.student_id] === "Leave" ? "active" : ""
                      }`}
                      onClick={() => markAttendance(s.student_id, "Leave")}
                    >
                      🟡 Leave
                    </button>
                  </td>
                  <td>
                    {attendance[s.student_id] ? (
                      <span
                        className={`status-badge ${
                          attendance[s.student_id].toLowerCase()
                        }`}
                      >
                        {attendance[s.student_id]}
                      </span>
                    ) : (
                      "Not Marked"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="save-btn" onClick={saveAttendance}>
            💾 Save Attendance
          </button>
          {message && <p className="save-message">{message}</p>}
        </>
      )}
    </div>
  );
};

export default Attendances;
