// // import React, { useState } from "react";
// // import "./LeaveForm.css";

// // const LeaveForm = () => {
// //   const [leaveType, setLeaveType] = useState("");
// //   const [startDate, setStartDate] = useState("");
// //   const [endDate, setEndDate] = useState("");
// //   const [reason, setReason] = useState("");
// //   const [submitted, setSubmitted] = useState(false);

// //   const handleSubmit = (e) => {
// //     e.preventDefault();

// //     if (!leaveType || !startDate || !endDate || !reason) {
// //       alert("Please fill all fields!");
// //       return;
// //     }

// //     // Normally here you would send the data to backend API
// //     console.log({ leaveType, startDate, endDate, reason });
// //     setSubmitted(true);
// //   };

// //   return (
// //     <div className="leave-form-container">
// //       <h2>Apply For Leave</h2>
// //       {submitted ? (
// //         <div className="success-msg">
// //           Your leave request has been submitted successfully!
// //         </div>
// //       ) : (
// //         <form className="leave-form" onSubmit={handleSubmit}>
// //           <label>
// //             Leave Type:
// //             <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
// //               <option value="">Select Leave Type</option>
// //               <option value="casual">Casual Leave</option>
// //               <option value="sick">Sick Leave</option>
// //               <option value="other">Other</option>
// //             </select>
// //           </label>

// //           <label>
// //             Start Date:
// //             <input
// //               type="date"
// //               value={startDate}
// //               onChange={(e) => setStartDate(e.target.value)}
// //             />
// //           </label>

// //           <label>
// //             End Date:
// //             <input
// //               type="date"
// //               value={endDate}
// //               onChange={(e) => setEndDate(e.target.value)}
// //             />
// //           </label>

// //           <label>
// //             Reason:
// //             <textarea
// //               value={reason}
// //               onChange={(e) => setReason(e.target.value)}
// //               placeholder="Enter your reason for leave"
// //             />
// //           </label>

// //           <button type="submit">Submit</button>
// //         </form>
// //       )}
// //     </div>
// //   );
// // };

// // export default LeaveForm;

// // src/components/LeaveForm.js
// import React, { useState } from "react";
// import axios from "axios";

// const LeaveForm = ({ studentId }) => {
//   const [leaveType, setLeaveType] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [reason, setReason] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!leaveType || !startDate || !endDate || !reason) {
//       alert("Please fill all fields!");
//       return;
//     }

//     try {
//       const res = await axios.post("http://localhost:5000/api/leaves", {
//         studentId,
//         leaveType,
//         startDate,
//         endDate,
//         reason,
//       });
//       setMessage("Leave request submitted successfully!");
//       setLeaveType("");
//       setStartDate("");
//       setEndDate("");
//       setReason("");
//     } catch (err) {
//       console.error(err);
//       setMessage("Error submitting leave request.");
//     }
//   };

//   return (
//     <div className="leave-form-container">
//       <h2>Apply For Leave</h2>
//       {message && <p>{message}</p>}
//       <form onSubmit={handleSubmit}>
//         <label>
//           Leave Type:
//           <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
//             <option value="">Select Leave Type</option>
//             <option value="Casual">Casual Leave</option>
//             <option value="Sick">Sick Leave</option>
//             <option value="Other">Other</option>
//           </select>
//         </label>
//         <label>
//           Start Date:
//           <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
//         </label>
//         <label>
//           End Date:
//           <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//         </label>
//         <label>
//           Reason:
//           <textarea
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//             placeholder="Enter reason"
//           />
//         </label>
//         <button type="submit">Submit Leave</button>
//       </form>
//     </div>
//   );
// };

// export default LeaveForm;

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const LeaveForm = ({ studentId }) => {
//   const [leaveType, setLeaveType] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [reason, setReason] = useState("");
//   const [message, setMessage] = useState("");
//   const [myLeaves, setMyLeaves] = useState([]);
//   const [showHistory, setShowHistory] = useState(false); // ✅ toggle for history tab

//   // Fetch leaves of this student
//   const fetchLeaves = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/leaves/student/${studentId}`);
//       setMyLeaves(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (studentId) fetchLeaves();
//   }, [studentId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!leaveType || !startDate || !endDate || !reason) {
//       alert("Please fill all fields!");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:5000/api/leaves", {
//         studentId,
//         leaveType,
//         startDate,
//         endDate,
//         reason,
//       });
//       setMessage("Leave request submitted successfully!");
//       setLeaveType("");
//       setStartDate("");
//       setEndDate("");
//       setReason("");
//       fetchLeaves(); // Refresh the list
//     } catch (err) {
//       console.error(err);
//       setMessage("Error submitting leave request.");
//     }
//   };

//   return (
//     <div className="leave-form-container">
//       <div className="header">
//         <h2>Apply For Leave</h2>
//         <button
//           style={{ marginLeft: "auto" }}
//           onClick={() => setShowHistory(!showHistory)}
//         >
//           {showHistory ? "Hide History" : "Leave History"}
//         </button>
//       </div>

//       {message && <p>{message}</p>}

//       {!showHistory && (
//         <form onSubmit={handleSubmit}>
//   <label>
//     Leave Type:
//     <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
//       <option value="">Select Leave Type</option>
//       <option value="Casual">Casual Leave</option>
//       <option value="Sick">Sick Leave</option>
//       <option value="Other">Other</option>
//     </select>
//   </label>

//   <label>
//     Start Date:
//     <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
//   </label>

//   <label>
//     End Date:
//     <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//   </label>

//   <label>
//     Reason:
//     <textarea
//       value={reason}
//       onChange={(e) => setReason(e.target.value)}
//       placeholder="Enter reason"
//     />
//   </label>

//   <button type="submit">Submit Leave</button>
// </form>

//       )}

//       {/* ✅ Leave history table */}
//       {/* {showHistory && (
//         <div className="leave-history">
//           {myLeaves.length === 0 ? (
//             <p>No leave requests yet.</p>
//           ) : (
//             <table>
//               <thead>
//                 <tr>
//                   <th>Type</th>
//                   <th>Start</th>
//                   <th>End</th>
//                   <th>Reason</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {myLeaves.map((leave) => (
//                   <tr key={leave._id}>
//                     <td>{leave.leaveType}</td>
//                     <td>{leave.startDate}</td>
//                     <td>{leave.endDate}</td>
//                     <td>{leave.reason}</td>
//                     <td
//                       style={{
//                         color:
//                           leave.status === "Approved"
//                             ? "green"
//                             : leave.status === "Denied"
//                             ? "red"
//                             : "orange",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {leave.status}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )} */}

//       {showHistory && (
//   <div className="leave-history-container">
//     <h2>Leave History</h2>
//     {myLeaves.length === 0 ? (
//       <p className="no-leaves">No leave requests yet.</p>
//     ) : (
//       <table className="leave-history-table">
//         <thead>
//           <tr>
//             <th>Type</th>
//             <th>Start Date</th>
//             <th>End Date</th>
//             <th>Reason</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {myLeaves.map((leave) => (
//             <tr key={leave._id}>
//               <td>{leave.leaveType}</td>
//               <td>{leave.startDate}</td>
//               <td>{leave.endDate}</td>
//               <td>{leave.reason}</td>
//               <td
//                 className={`status ${
//                   leave.status === "Approved"
//                     ? "approved"
//                     : leave.status === "Denied"
//                     ? "denied"
//                     : "pending"
//                 }`}
//               >
//                 {leave.status}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     )}
//   </div>
// )}

//     </div>
//   );
// };

// export default LeaveForm;












// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const LeaveForm = ({ studentId }) => {
//   const [leaveType, setLeaveType] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [reason, setReason] = useState("");
//   const [message, setMessage] = useState("");
//   const [myLeaves, setMyLeaves] = useState([]);
//   const [showHistory, setShowHistory] = useState(false); // ✅ toggle for history tab

//   // Fetch leaves of this student
//   const fetchLeaves = async () => {
//     try {
//       const res = await axios.get(`http://localhost:5000/api/leaves/student/${studentId}`);
//       setMyLeaves(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (studentId) fetchLeaves();
//   }, [studentId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!leaveType || !startDate || !endDate || !reason) {
//       alert("Please fill all fields!");
//       return;
//     }

//     try {
//       await axios.post("http://localhost:5000/api/leaves", {
//         studentId,
//         leaveType,
//         startDate,
//         endDate,
//         reason,
//       });
//       setMessage("Leave request submitted successfully!");
//       setLeaveType("");
//       setStartDate("");
//       setEndDate("");
//       setReason("");
//       fetchLeaves(); // Refresh the list
//     } catch (err) {
//       console.error(err);
//       setMessage("Error submitting leave request.");
//     }
//   };

//   return (
//     <div className="leave-form-container">
//       <div className="header">
//         <h2>Apply For Leave</h2>
//         <button
//           style={{ marginLeft: "auto" }}
//           onClick={() => setShowHistory(!showHistory)}
//         >
//           {showHistory ? "Hide History" : "Leave History"}
//         </button>
//       </div>

//       {message && <p>{message}</p>}

//       {!showHistory && (
//         <form onSubmit={handleSubmit}>
//           <label>
//             Leave Type:
//             <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
//               <option value="">Select Leave Type</option>
//               <option value="Casual">Casual Leave</option>
//               <option value="Sick">Sick Leave</option>
//               <option value="Other">Other</option>
//             </select>
//           </label>
//           <label>
//             Start Date:
//             <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
//           </label>
//           <label>
//             End Date:
//             <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//           </label>
//           <label>
//             Reason:
//             <textarea
//               value={reason}
//               onChange={(e) => setReason(e.target.value)}
//               placeholder="Enter reason"
//             />
//           </label>
//           <button type="submit">Submit Leave</button>
//         </form>
//       )}

//       {/* ✅ Leave history table */}
//       {showHistory && (
//         <div className="leave-history">
//           {myLeaves.length === 0 ? (
//             <p>No leave requests yet.</p>
//           ) : (
//             <table>
//               <thead>
//                 <tr>
//                   <th>Type</th>
//                   <th>Start</th>
//                   <th>End</th>
//                   <th>Reason</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {myLeaves.map((leave) => (
//                   <tr key={leave._id}>
//                     <td>{leave.leaveType}</td>
//                     <td>{leave.startDate}</td>
//                     <td>{leave.endDate}</td>
//                     <td>{leave.reason}</td>
//                     <td
//                       style={{
//                         color:
//                           leave.status === "Approved"
//                             ? "green"
//                             : leave.status === "Denied"
//                             ? "red"
//                             : "orange",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {leave.status}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default LeaveForm;



import React, { useState, useEffect } from "react";
import axios from "axios";

const LeaveForm = ({ studentId }) => {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [myLeaves, setMyLeaves] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch leaves of this student
  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/leaves/student/${studentId}`);
      setMyLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (studentId) fetchLeaves();
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!leaveType || !startDate || !endDate || !reason) {
      alert("Please fill all fields!");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/leaves", {
        studentId,
        leaveType,
        startDate,
        endDate,
        reason,
      });
      setMessage("Leave request submitted successfully!");
      setLeaveType("");
      setStartDate("");
      setEndDate("");
      setReason("");
      fetchLeaves();
    } catch (err) {
      console.error(err);
      setMessage("Error submitting leave request.");
    }
  };

  return (
    <div className="leave-container">
      <div className="leave-header">
        <h2 className="leave-title">Apply For Leave</h2>
        <button
          className="toggle-history-btn"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "Hide History" : "Leave History"}
        </button>
      </div>

      {message && <p className="leave-message">{message}</p>}

      {!showHistory && (
        <form className="leave-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Leave Type:</label>
            <select
              className="leave-input"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option value="">Select Leave Type</option>
              <option value="Casual">Casual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Start Date:</label>
            <input
              className="leave-input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>End Date:</label>
            <input
              className="leave-input"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Reason:</label>
            <textarea
              className="leave-input leave-textarea"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason"
            />
          </div>

          <button className="submit-leave-btn" type="submit">
            Submit Leave
          </button>
        </form>
      )}

      {showHistory && (
  <div className="history-container">
    {myLeaves.length === 0 ? (
      <p className="history-empty">No leave requests yet.</p>
    ) : (
      <div className="history-table-wrapper">
        <table className="history-table">
          <thead>
            <tr className="history-header-row">
              <th className="history-header-cell">Leave Type</th>
              <th className="history-header-cell">Start Date</th>
              <th className="history-header-cell">End Date</th>
              <th className="history-header-cell">Reason</th>
              <th className="history-header-cell">Status</th>
            </tr>
          </thead>
          <tbody>
            {myLeaves.map((leave, index) => (
              <tr
                key={leave._id}
                className={`history-row ${index % 2 === 0 ? "even-row" : "odd-row"}`}
              >
                <td className="history-cell">{leave.leaveType}</td>
                <td className="history-cell">{leave.startDate}</td>
                <td className="history-cell">{leave.endDate}</td>
                <td className="history-cell">{leave.reason}</td>
                <td
                  className={`history-cell status-cell ${
                    leave.status === "Approved"
                      ? "status-approved"
                      : leave.status === "Denied"
                      ? "status-denied"
                      : "status-pending"
                  }`}
                >
                  {leave.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
)}

    </div>
  );
};

export default LeaveForm;
