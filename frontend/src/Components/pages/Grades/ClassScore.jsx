



// import React, { useState, useEffect } from "react";
// import "./ClassScore.css";

// const ClassScore = ({ students, goBack }) => {
//   const [testDetails, setTestDetails] = useState({
//     testName: "",
//     subject: "",
//     date: "",
//     maxScore: "",
//   });

//   const [scoreData, setScoreData] = useState([]);
//   const [isTestSelected, setIsTestSelected] = useState(false); // ✅ Track if test is selected

//   // ✅ Students ko local state me set karo
//   useEffect(() => {
//     setScoreData(
//       students.map((s) => ({
//         student_id: s.student_id,
//         name: s.name,
//         course: s.course,
//         marks: "",
//       }))
//     );
//   }, [students]);

//   // ✅ Test details change handler
//   const handleTestDetailChange = (e) => {
//     const { name, value } = e.target;
//     setTestDetails({ ...testDetails, [name]: value });
//   };

//   // ✅ Marks input change handler
//   const handleMarksChange = (idx, value) => {
//     if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
//       const updated = [...scoreData];
//       updated[idx].marks = value;
//       setScoreData(updated);
//     }
//   };

//   // ✅ Save button
//   const handleSave = () => {
//     if (!isTestSelected) {
//       alert("⚠️ Please select the test first!");
//       return;
//     }
//     console.log("📌 Test Details:", testDetails);
//     console.log("📌 Student Marks:", scoreData);
//     alert("✅ Test & Marks Saved Successfully!");
//     // TODO: API call for saving test + marks
//   };

//   return (
//     <section className="classscore-page">
//       <div className="card full-card">
//         {/* Header */}
//         <div
//           className="card-header"
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <button className="btn back-btn" onClick={goBack}>
//             ⬅ Back
//           </button>
//           <h2>Regular Test Scores</h2>
//           <button className="btn upload-btn" onClick={handleSave}>
//             Save All
//           </button>
//         </div>

//         {/* Test Details Form */}
//         <div className="test-details-form">
//           <h3>Test Details</h3>
//           <div className="form-row">
//             <input
//               type="text"
//               name="testName"
//               value={testDetails.testName}
//               onChange={handleTestDetailChange}
//               placeholder="Test Name (e.g. Unit Test 1)"
//             />
//             <input
//               type="text"
//               name="subject"
//               value={testDetails.subject}
//               onChange={handleTestDetailChange}
//               placeholder="Subject"
//             />
//             <input
//               type="date"
//               name="date"
//               value={testDetails.date}
//               onChange={handleTestDetailChange}
//             />
//             <input
//               type="number"
//               name="maxScore"
//               value={testDetails.maxScore}
//               onChange={handleTestDetailChange}
//               placeholder="Max Score"
//             />
//           </div>

//           {/* ✅ Done / Select Button */}
//           <button
//             className={`btn select-btn ${isTestSelected ? "selected" : ""}`}
//             onClick={() => {
//               if (
//                 !testDetails.testName ||
//                 !testDetails.subject ||
//                 !testDetails.date ||
//                 !testDetails.maxScore
//               ) {
//                 alert("⚠️ Fill all test details before selecting!");
//                 return;
//               }
//               setIsTestSelected(!isTestSelected);
//             }}
//           >
//             {isTestSelected ? "✔ Test Selected" : "Select / Done"}
//           </button>
//         </div>

//         {/* Table */}
//         {isTestSelected && (
//           <div className="testscore-body">
//             <h3>Enter Student Marks</h3>
//             <table className="risk-table mt-4">
//               <thead>
//                 <tr>
//                   <th>Student ID</th>
//                   <th>Name</th>
//                   <th>Course</th>
//                   <th>Marks</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {scoreData.length === 0 ? (
//                   <tr>
//                     <td
//                       colSpan="4"
//                       style={{ textAlign: "center", padding: "20px" }}
//                     >
//                       No student records available.
//                     </td>
//                   </tr>
//                 ) : (
//                   scoreData.map((s, idx) => (
//                     <tr key={idx}>
//                       <td>{s.student_id || "-"}</td>
//                       <td>{s.name || "-"}</td>
//                       <td>{s.course || "-"}</td>
//                       <td>
//                         <input
//                           type="number"
//                           value={s.marks}
//                           onChange={(e) => handleMarksChange(idx, e.target.value)}
//                           className="table-input"
//                           placeholder="Enter marks"
//                           max={testDetails.maxScore}
//                         />
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };

// export default ClassScore;




import React, { useState, useEffect } from "react";
import "./ClassScore.css";

const ClassScore = ({ students, goBack }) => {
  const [testDetails, setTestDetails] = useState({
    testName: "",
    subject: "",
    date: "",
    maxScore: "",
  });

  const [scoreData, setScoreData] = useState([]);
  const [isTestSelected, setIsTestSelected] = useState(false);

  useEffect(() => {
    setScoreData(
      students.map((s) => ({
        student_id: s.student_id,
        name: s.name,
        course: s.course,
        marks: "",
      }))
    );
  }, [students]);

  const handleTestDetailChange = (e) => {
    const { name, value } = e.target;
    setTestDetails({ ...testDetails, [name]: value });
  };

  const handleMarksChange = (idx, value) => {
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      const updated = [...scoreData];
      updated[idx].marks = value;
      setScoreData(updated);
    }
  };

  const handleSave = () => {
    if (!isTestSelected) {
      alert("⚠️ Please select the test first!");
      return;
    }
    console.log("📌 Test Details:", testDetails);
    console.log("📌 Student Marks:", scoreData);
    alert("✅ Test & Marks Saved Successfully!");
    // TODO: API call
  };

  return (
    <section className="classscore-page">
      <div className="classscore-card full-card">
        {/* Header */}
        <div className="classscore-header">
          <button className="classscore-btn back-btn" onClick={goBack}>
            ⬅ Back
          </button>
          <h2 className="classscore-title">Regular Test Scores</h2>
          <button className="classscore-btn save-btn" onClick={handleSave}>
            Save All
          </button>
        </div>

        {/* Test Details */}
        <div className="classscore-test-details">
          <h3>Test Details</h3>
          <div className="classscore-form-row">
            <input
              type="text"
              name="testName"
              value={testDetails.testName}
              onChange={handleTestDetailChange}
              placeholder="Test Name"
              className="classscore-input"
            />
            <input
              type="text"
              name="subject"
              value={testDetails.subject}
              onChange={handleTestDetailChange}
              placeholder="Subject"
              className="classscore-input"
            />
            <input
              type="date"
              name="date"
              value={testDetails.date}
              onChange={handleTestDetailChange}
              className="classscore-input"
            />
            <input
              type="number"
              name="maxScore"
              value={testDetails.maxScore}
              onChange={handleTestDetailChange}
              placeholder="Max Score"
              className="classscore-input"
            />
          </div>

          <button
            className={`classscore-btn select-btn ${
              isTestSelected ? "selected" : ""
            }`}
            onClick={() => {
              if (
                !testDetails.testName ||
                !testDetails.subject ||
                !testDetails.date ||
                !testDetails.maxScore
              ) {
                alert("⚠️ Fill all test details before selecting!");
                return;
              }
              setIsTestSelected(!isTestSelected);
            }}
          >
            {isTestSelected ? "✔ Test Selected" : "Done"}
          </button>
        </div>

        {/* Student Marks Table */}
        {isTestSelected && (
          <div className="classscore-table-body">
            <h3>Enter Student Marks</h3>
            <table className="classscore-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Marks</th>
                </tr>
              </thead>
              <tbody>
                {scoreData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="classscore-no-data">
                      No student records available.
                    </td>
                  </tr>
                ) : (
                  scoreData.map((s, idx) => (
                    <tr key={idx}>
                      <td>{s.student_id || "-"}</td>
                      <td>{s.name || "-"}</td>
                      <td>{s.course || "-"}</td>
                      <td>
                        <input
                          type="number"
                          value={s.marks}
                          onChange={(e) =>
                            handleMarksChange(idx, e.target.value)
                          }
                          className="classscore-input"
                          placeholder="Enter marks"
                          max={testDetails.maxScore}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClassScore;




