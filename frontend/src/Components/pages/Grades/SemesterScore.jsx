// import React, { useState, useEffect } from "react";
// import "./TestScores.css";

// const TestScores = ({ students }) => {
//   const [scoreData, setScoreData] = useState([]);

//   useEffect(() => {
//     setScoreData(
//       students.map((s) => ({
//         student_id: s.student_id,
//         name: s.name,
//         course: s.course,
//         Sem1: s.Sem1 || "",
//         Sem2: s.Sem2 || "",
//         TestScore: s.TestScore || "",
//       }))
//     );
//   }, [students]);

//   const handleChange = (idx, field, value) => {
//     // Allow only numbers and decimal
//     if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
//       const updated = [...scoreData];
//       updated[idx][field] = value;
//       setScoreData(updated);
//     }
//   };

//   const handleSave = () => {
//     // Optionally: validate all fields filled
//     const invalid = scoreData.some(
//       (s) =>
//         s.Sem1 === "" ||
//         s.Sem2 === "" ||
//         s.TestScore === "" ||
//         isNaN(parseFloat(s.Sem1)) ||
//         isNaN(parseFloat(s.Sem2)) ||
//         isNaN(parseFloat(s.TestScore))
//     );

//     if (invalid) {
//       alert("Please fill all scores with valid numbers before saving!");
//       return;
//     }

//     // For now, just log the data
//     console.log("Saved Test Scores:", scoreData);

//     // TODO: send to backend API
//     // axios.post("/api/save-test-scores", scoreData)
//     //   .then(res => alert("Saved successfully!"))
//     //   .catch(err => alert("Error saving data"));
//     alert("Test scores saved successfully!");
//   };

//   return (
//     <section className="testscore-page">
//       <div className="card full-card">
//         {/* <div className="card-header">
//           <h2>Student Test Scores</h2>
//         </div>

//         <div style={{ marginBottom: "15px", textAlign: "right" }}>
//             <button className="btn upload-btn" onClick={handleSave}>
//                 Save All
//             </button>
//         </div> */}
//         <div
//           className="card-header"
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <h2>Student Test Scores</h2>
//           <button className="btn upload-btn" onClick={handleSave}>
//             Save All
//           </button>
//         </div>

//         <div className="testscore-body">
//           <table className="risk-table mt-4">
//             <thead>
//               <tr>
//                 <th>Student ID</th>
//                 <th>Name</th>
//                 <th>Course</th>
//                 <th>Sem 1</th>
//                 <th>Sem 2</th>
//                 {/* <th>Test Score</th> */}
//               </tr>
//             </thead>
//             <tbody>
//               {!scoreData || scoreData.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="6"
//                     style={{ textAlign: "center", padding: "20px" }}
//                   >
//                     No student records available.
//                   </td>
//                 </tr>
//               ) : (
//                 scoreData.map((s, idx) => (
//                   <tr key={idx}>
//                     <td>{s.student_id || "-"}</td>
//                     <td>{s.name || "-"}</td>
//                     <td>{s.course || "-"}</td>
//                     <td>
//                       <input
//                         type="text"
//                         value={s.Sem1}
//                         onChange={(e) =>
//                           handleChange(idx, "Sem1", e.target.value)
//                         }
//                         className="table-input"
//                       />
//                     </td>
//                     <td>
//                       <input
//                         type="text"
//                         value={s.Sem2}
//                         onChange={(e) =>
//                           handleChange(idx, "Sem2", e.target.value)
//                         }
//                         className="table-input"
//                       />
//                     </td>
//                     {/* <td>
//                       <input
//                         type="text"
//                         value={s.TestScore}
//                         onChange={(e) => handleChange(idx, "TestScore", e.target.value)}
//                         className="table-input"
//                       />
//                     </td> */}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TestScores;

// import React, { useState, useEffect } from "react";
// import "./TestScores.css";

// const TestScores = ({ students }) => {
//   const [scoreData, setScoreData] = useState([]);
//   const [selectedYear, setSelectedYear] = useState(1);
//   const [selectedSem, setSelectedSem] = useState("Sem1");

//   useEffect(() => {
//     setScoreData(
//       students.map((s) => ({
//         student_id: s.student_id,
//         name: s.name,
//         course: s.course,
//         Sem1: s.Sem1 || "",
//         Sem2: s.Sem2 || "",
//         Sem3: s.Sem3 || "",
//         Sem4: s.Sem4 || "",
//         Sem5: s.Sem5 || "",
//         Sem6: s.Sem6 || "",
//         Sem7: s.Sem7 || "",
//         Sem8: s.Sem8 || "",
//       }))
//     );
//   }, [students]);

//   // ✅ Map Year → Semesters
//   const semesterOptions = {
//     1: ["Sem1", "Sem2"],
//     2: ["Sem3", "Sem4"],
//     3: ["Sem5", "Sem6"],
//     4: ["Sem7", "Sem8"],
//   };

//   // ✅ Handle change
//   const handleChange = (idx, sem, value) => {
//     if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
//       const updated = [...scoreData];
//       updated[idx][sem] = value;
//       setScoreData(updated);
//     }
//   };

//   const handleYearChange = (year) => {
//     setSelectedYear(year);
//     setSelectedSem(semesterOptions[year][0]); // default pehle wala sem select hoga
//   };

//   const handleSave = () => {
//     console.log("Saved:", scoreData);
//     alert(`Marks saved for ${selectedYear} - ${selectedSem}`);
//   };

//   return (
//     <section className="testscore-page">
//       <div className="card full-card">
//         <div
//           className="card-header"
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <h2>Student Test Scores</h2>
//           <button className="btn upload-btn" onClick={handleSave}>
//             Save All
//           </button>
//         </div>

//         <div className="testscore-body">
//           {/* ✅ Dropdowns for Year & Semester */}
//           <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
//             <label>Year:</label>
//             <select
//               value={selectedYear}
//               onChange={(e) => handleYearChange(Number(e.target.value))}
//             >
//               <option value={1}>Year 1</option>
//               <option value={2}>Year 2</option>
//               <option value={3}>Year 3</option>
//               <option value={4}>Year 4</option>
//             </select>

//             <label>Semester:</label>
//             <select
//               value={selectedSem}
//               onChange={(e) => setSelectedSem(e.target.value)}
//             >
//               {semesterOptions[selectedYear].map((sem) => (
//                 <option key={sem} value={sem}>
//                   {sem}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <table className="risk-table mt-4">
//             <thead>
//               <tr>
//                 <th>Student ID</th>
//                 <th>Name</th>
//                 <th>Course</th>
//                 <th>{selectedSem}</th>
//               </tr>
//             </thead>
//             <tbody>
//               {scoreData.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
//                     No student records available.
//                   </td>
//                 </tr>
//               ) : (
//                 scoreData.map((s, idx) => (
//                   <tr key={idx}>
//                     <td>{s.student_id || "-"}</td>
//                     <td>{s.name || "-"}</td>
//                     <td>{s.course || "-"}</td>
//                     <td>
//                       <input
//                         type="text"
//                         value={s[selectedSem]}
//                         onChange={(e) => handleChange(idx, selectedSem, e.target.value)}
//                         className="table-input"
//                       />
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TestScores;




// import React, { useState, useEffect } from "react";
// import "./SemesterScore.css";

// const TestScores = ({ students, goBack }) => {
//   const [scoreData, setScoreData] = useState([]);
//   const [selectedYear, setSelectedYear] = useState(1);
//   const [selectedSem, setSelectedSem] = useState("Sem1");

//   useEffect(() => {
//     setScoreData(
//       students.map((s) => ({
//         student_id: s.student_id,
//         name: s.name,
//         course: s.course,
//         Sem1: s.Sem1 || "",
//         Sem2: s.Sem2 || "",
//         Sem3: s.Sem3 || "",
//         Sem4: s.Sem4 || "",
//         Sem5: s.Sem5 || "",
//         Sem6: s.Sem6 || "",
//         Sem7: s.Sem7 || "",
//         Sem8: s.Sem8 || "",
//       }))
//     );
//   }, [students]);

//   // ✅ Year → Sem mapping
//   const semesterOptions = {
//     1: ["Sem1", "Sem2"],
//     2: ["Sem3", "Sem4"],
//     3: ["Sem5", "Sem6"],
//     4: ["Sem7", "Sem8"],
//   };

//   const handleChange = (idx, sem, value) => {
//     if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
//       const updated = [...scoreData];
//       updated[idx][sem] = value;
//       setScoreData(updated);
//     }
//   };

//   const handleYearChange = (year) => {
//     setSelectedYear(year);
//     setSelectedSem(semesterOptions[year][0]); // default pehla semester
//   };

//   const handleSave = () => {
//     console.log("Saved:", scoreData);
//     alert(`Marks saved for ${selectedYear} - ${selectedSem}`);
//   };

//   return (
//     <section className="testscore-page">
//       <div className="card full-card">
//         <div
//           className="card-header"
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//                     <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             {goBack && (
//               <button className="btn" onClick={goBack}>
//                 ⬅ Back
//               </button>
//             )}
//             <h2>Student Semester Scores</h2>
//           </div>
          
//           <button className="btn upload-btn" onClick={handleSave}>
//             Save All
//           </button>
//         </div>

//         <div className="testscore-body">
//           <table className="risk-table mt-4">
//             <thead>
//               <tr>
//                 <th>Student ID</th>
//                 <th>Name</th>
//                 <th>Course</th>

//                 {/* ✅ Year dropdown in header */}
//                 <th>
//                   <label style={{ marginRight: "5px" }}>Year:</label>
//                   <select
//                     value={selectedYear}
//                     onChange={(e) => handleYearChange(Number(e.target.value))}
//                   >
//                     <option value={1}>Year 1</option>
//                     <option value={2}>Year 2</option>
//                     <option value={3}>Year 3</option>
//                     <option value={4}>Year 4</option>
//                   </select>
//                 </th>

//                 {/* ✅ Semester dropdown in header */}
//                 <th>
//                   <label style={{ marginRight: "5px" }}>Semester:</label>
//                   <select
//                     value={selectedSem}
//                     onChange={(e) => setSelectedSem(e.target.value)}
//                   >
//                     {semesterOptions[selectedYear].map((sem) => (
//                       <option key={sem} value={sem}>
//                         {sem}
//                       </option>
//                     ))}
//                   </select>
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {scoreData.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
//                     No student records available.
//                   </td>
//                 </tr>
//               ) : (
//                 scoreData.map((s, idx) => (
//                   <tr key={idx}>
//                     <td>{s.student_id || "-"}</td>
//                     <td>{s.name || "-"}</td>
//                     <td>{s.course || "-"}</td>
//                     <td colSpan="2">
//                       <input
//                         type="text"
//                         value={s[selectedSem]}
//                         onChange={(e) => handleChange(idx, selectedSem, e.target.value)}
//                         className="table-input"
//                         placeholder={`Enter marks for ${selectedSem}`}
//                       />
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TestScores;

















import React, { useState, useEffect } from "react";
import "./SemesterScore.css"; // CSS file remains same, you can update class names inside it too

const SemesterScore = ({ students, goBack }) => {
  const [scoreData, setScoreData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(1);
  const [selectedSem, setSelectedSem] = useState("Sem1");

  useEffect(() => {
    setScoreData(
      students.map((s) => ({
        student_id: s.student_id,
        name: s.name,
        course: s.course,
        Sem1: s.Sem1 || "",
        Sem2: s.Sem2 || "",
        Sem3: s.Sem3 || "",
        Sem4: s.Sem4 || "",
        Sem5: s.Sem5 || "",
        Sem6: s.Sem6 || "",
        Sem7: s.Sem7 || "",
        Sem8: s.Sem8 || "",
      }))
    );
  }, [students]);

  const semesterOptions = {
    1: ["Sem1", "Sem2"],
    2: ["Sem3", "Sem4"],
    3: ["Sem5", "Sem6"],
    4: ["Sem7", "Sem8"],
  };

  const handleChange = (idx, sem, value) => {
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      const updated = [...scoreData];
      updated[idx][sem] = value;
      setScoreData(updated);
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSelectedSem(semesterOptions[year][0]);
  };

  const handleSave = () => {
    console.log("Saved:", scoreData);
    alert(`Marks saved for Year ${selectedYear} - ${selectedSem}`);
  };

  return (
    <section className="semester-score-page">
      <div className="semester-score-card">
        {/* Header */}
        <div className="semester-score-header">
          <div className="semester-score-title">
            {goBack && (
              <button className="btn back-btn" onClick={goBack}>
                ⬅ Back
              </button>
            )}
            <h2>Student Semester Scores</h2>
          </div>
          <button className="btn save-btn" onClick={handleSave}>
            Save All
          </button>
        </div>

        <div className="semester-score-body">
          <table className="semester-score-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>
                  <select
                    value={selectedYear}
                    onChange={(e) => handleYearChange(Number(e.target.value))}
                  >
                    <option value={1}>Year 1</option>
                    <option value={2}>Year 2</option>
                    <option value={3}>Year 3</option>
                    <option value={4}>Year 4</option>
                  </select>
                </th>
                <th>
                  <select
                    value={selectedSem}
                    onChange={(e) => setSelectedSem(e.target.value)}
                  >
                    {semesterOptions[selectedYear].map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                </th>
                <th>Marks</th>
              </tr>
            </thead>

            <tbody>
              {scoreData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-records">
                    No student records available.
                  </td>
                </tr>
              ) : (
                scoreData.map((s, idx) => (
                  <tr key={idx}>
                    <td>{s.student_id || "-"}</td>
                    <td>{s.name || "-"}</td>
                    <td>{s.course || "-"}</td>
                    <td>{selectedYear}</td>
                    <td>{selectedSem}</td>
                    <td>
                      <input
                        type="text"
                        value={s[selectedSem]}
                        onChange={(e) => handleChange(idx, selectedSem, e.target.value)}
                        className="semester-score-input"
                        placeholder={`Enter marks for ${selectedSem}`}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default SemesterScore;








// import React, { useState, useEffect } from "react";
// import "./SemesterScore.css";

// const TestScores = ({ students, goBack }) => {
//   const [scoreData, setScoreData] = useState([]);
//   const [selectedYear, setSelectedYear] = useState(1);
//   const [selectedSem, setSelectedSem] = useState("Sem1");

//   useEffect(() => {
//     setScoreData(
//       students.map((s) => ({
//         student_id: s.student_id,
//         name: s.name,
//         course: s.course,
//         Sem1: s.Sem1 || "",
//         Sem2: s.Sem2 || "",
//         Sem3: s.Sem3 || "",
//         Sem4: s.Sem4 || "",
//         Sem5: s.Sem5 || "",
//         Sem6: s.Sem6 || "",
//         Sem7: s.Sem7 || "",
//         Sem8: s.Sem8 || "",
//       }))
//     );
//   }, [students]);

//   // Year → Sem mapping
//   const semesterOptions = {
//     1: ["Sem1", "Sem2"],
//     2: ["Sem3", "Sem4"],
//     3: ["Sem5", "Sem6"],
//     4: ["Sem7", "Sem8"],
//   };

//   const handleChange = (idx, sem, value) => {
//     if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
//       const updated = [...scoreData];
//       updated[idx][sem] = value;
//       setScoreData(updated);
//     }
//   };

//   const handleYearChange = (year) => {
//     setSelectedYear(year);
//     setSelectedSem(semesterOptions[year][0]);
//   };

//   const handleSave = () => {
//     console.log("Saved:", scoreData);
//     alert(`Marks saved for Year ${selectedYear} - ${selectedSem}`);
//   };

//   return (
//     <section className="testscore-page">
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
//           <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//             {goBack && (
//               <button className="btn" onClick={goBack}>
//                 ⬅ Back
//               </button>
//             )}
//             <h2>Student Semester Scores</h2>
//           </div>

//           <button className="btn upload-btn" onClick={handleSave}>
//             Save All
//           </button>
//         </div>

//         <div className="testscore-body">
//           {/* Table */}
//           <table className="risk-table mt-4">
//             <thead>
//               <tr>
//                 <th>Student ID</th>
//                 <th>Name</th>
//                 <th>Course</th>

//                 {/* ✅ Year dropdown in header */}
//                 <th>
//                   <select
//                     value={selectedYear}
//                     onChange={(e) => handleYearChange(Number(e.target.value))}
//                   >
//                     <option value={1}>Year 1</option>
//                     <option value={2}>Year 2</option>
//                     <option value={3}>Year 3</option>
//                     <option value={4}>Year 4</option>
//                   </select>
//                 </th>

//                 {/* ✅ Semester dropdown in header */}
//                 <th>
//                   <select
//                     value={selectedSem}
//                     onChange={(e) => setSelectedSem(e.target.value)}
//                   >
//                     {semesterOptions[selectedYear].map((sem) => (
//                       <option key={sem} value={sem}>
//                         {sem}
//                       </option>
//                     ))}
//                   </select>
//                 </th>

//                 <th>Marks</th>
//               </tr>
//             </thead>

//             <tbody>
//               {scoreData.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
//                     No student records available.
//                   </td>
//                 </tr>
//               ) : (
//                 scoreData.map((s, idx) => (
//                   <tr key={idx}>
//                     <td>{s.student_id || "-"}</td>
//                     <td>{s.name || "-"}</td>
//                     <td>{s.course || "-"}</td>
//                     <td>{selectedYear}</td>
//                     <td>{selectedSem}</td>
//                     <td>
//                       <input
//                         type="text"
//                         value={s[selectedSem]}
//                         onChange={(e) => handleChange(idx, selectedSem, e.target.value)}
//                         className="table-input"
//                         placeholder={`Enter marks for ${selectedSem}`}
//                       />
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default TestScores;


