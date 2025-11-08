// import React, { useState } from "react";
// import "./Student.css";
// import StudentDetail from "../StudentDetails/StudentDetail";

// const Student = ({ studentData, goBack, onMarkForCounselling }) => {
//   const [selectedStudent, setSelectedStudent] = useState(null);

//   const students = Array.isArray(studentData) ? studentData : [studentData];

//   if (selectedStudent) {
//     return (
//       <StudentDetail
//         student={selectedStudent}
//         onBack={() => setSelectedStudent(null)}
//         onMarkForCounselling={onMarkForCounselling} // ✅ pass kar diya
//       />
//     );
//   }

//   if (!students || students.length === 0) {
//     return <div>No students found. Please upload Excel file.</div>;
//   }

//   const getRiskBadge = (risk) => {
//     if (!risk) return <span className="badge badge-na">N/A</span>;

//     const cls =
//       risk === "High"
//         ? "badge-high"
//         : risk === "Moderate"
//         ? "badge-moderate"
//         : "badge-low";
//     return <span className={`badge ${cls}`}>{risk}</span>;
//   };

//   return (
//     <div className="student-details-page">
//       <button className="back-btn" onClick={goBack}>
//         ← Back to Dashboard
//       </button>

//       {students.map((student, index) => {
//         const otherFields = Object.keys(student).filter(
//           (key) =>
//             ![
//               "name",
//               "Student ID",
//               "course",
//               "dropout_probability",
//               "risk",
//               "prediction",
//             ].includes(key)
//         );

//         return (
//           <div key={index} className="student-cards">
//             {/* Basic Info Card */}
//             <div className="card" onClick={() => setSelectedStudent(student)}>
//               <h3>Student Detail</h3>
//               <p>
//                 <strong>Name:</strong> {student.name || "N/A"}
//               </p>
//               <p>
//                 <strong>Student ID:</strong> {student["Student ID"] || "N/A"}
//               </p>
//               <p>
//                 <strong>Course:</strong> {student.course || "N/A"}
//               </p>
//             </div>

//             {/* Prediction Info Card */}
//             {/* <div className="card" onClick={() => setSelectedStudent(student)}>
//               <h3>Prediction Info</h3>
//               <p>
//                 <strong>Dropout Probability:</strong>{" "}
//                 {student.dropout_probability !== undefined &&
//                 student.dropout_probability !== null
//                   ? student.dropout_probability.toFixed(2) + "%"
//                   : "N/A"}
//               </p>
//               <p>
//                 <strong>Risk Level:</strong> {getRiskBadge(student.risk)}
//               </p>
//               <p>
//                 <strong>Prediction:</strong> {student.prediction || "N/A"}
//               </p>
//             </div> */}

//             {/* Other Fields Card */}
//             {/* <div
//               className="card other-fields"
//               onClick={() => setSelectedStudent(student)}
//             >
//               <h3>Other Details</h3>
//               {otherFields.length === 0 ? (
//                 <p>No additional information.</p>
//               ) : (
//                 otherFields.map((key) => (
//                   <p key={key}>
//                     <strong>{key}:</strong> {student[key] || "N/A"}
//                   </p>
//                 ))
//               )}
//             </div> */}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default Student;



import React, { useState } from "react";
import "./Student.css";
import StudentDetail from "../StudentDetails/StudentDetail";

const Student = ({ studentData, goBack,onMarkForCounselling }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const students = Array.isArray(studentData) ? studentData : [studentData];

  if (selectedStudent) {
    return (
      <StudentDetail
        student={selectedStudent}
        onBack={() => setSelectedStudent(null)}
          onMarkForCounselling={() => {
          // Use Dashboard's function
          onMarkForCounselling(selectedStudent);
          // alert(`${selectedStudent.name} marked for counselling!`);
        }}
      />
    );
  }

  if (!students || students.length === 0) {
    return <div>No students found. Please upload Excel file.</div>;
  }

  const getRiskBadge = (risk) => {
    if (!risk) return <span className="badge badge-na">N/A</span>;

    const cls =
      risk === "High"
        ? "badge-high"
        : risk === "Moderate"
        ? "badge-moderate"
        : "badge-low";
    return <span className={`badge ${cls}`}>{risk}</span>;
  };

  // ✅ Search function
  const handleSearch = () => {
    const search = searchTerm.toLowerCase();
    const foundStudent = students.find(
      (student) =>
        (student.name || "").toLowerCase().includes(search) ||
        (student["Student ID"] || "").toString().toLowerCase().includes(search)
    );

    if (foundStudent) {
      setSelectedStudent(foundStudent);
    } else {
      alert("No matching student found!");
    }
  };
  

  // Sort students by Student ID alphabetically
  const sortedStudents = [...students].sort((a, b) => {
    const idA = (a["Student ID"] || "").toString().toLowerCase();
    const idB = (b["Student ID"] || "").toString().toLowerCase();
    return idA.localeCompare(idB); // alphabetical order
  });

  return (
    <div className="student-details-page">
      <button className="back-btn" onClick={goBack}>
        ← Back to Dashboard
      </button>

      {/* 🔎 Search Bar with Enter + Button */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Student Name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()} // ⬅️ Enter press kare to search ho
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Agar koi search ke bina table dekhna chahe to pura list show ho */}
      <div className="student-table-container">
        <table className="student-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Course</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student, index) => (
              <tr key={index} onClick={() => setSelectedStudent(student)}>
                <td>{student["Student ID"] || "N/A"}</td>
                <td>{student.name || "N/A"}</td>
                <td>{student.course || "N/A"}</td>
                <td>{getRiskBadge(student.risk)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Student;



