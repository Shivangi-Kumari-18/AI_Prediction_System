import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FeeManagement.css";

const FeeManagement = () => {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    studentId: "",
    amount: "",
    date: "",
    mode: "",
    remarks: "",
  });
  const [paymentsHistory, setPaymentsHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const today = new Date();

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students"); // your student route
      setStudents(res.data);
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  // Fetch payments from backend
  const fetchPayments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/payments");
      setPaymentsHistory(res.data);
    } catch (error) {
      console.error("Failed to fetch payments", error);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchPayments();
  }, []);

  // Status logic
  const getStatus = (student) => {
    const due = new Date(student.dueDate);
    if (student.paidFees >= student.totalFees) return "Up-to-date";
    if (student.paidFees < student.totalFees && today <= due) return "Pending";
    if (student.paidFees < student.totalFees && today > due) return "Overdue";
  };

  // Add payment
  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/payments", form);
      alert("Payment saved successfully!");

      setForm({ studentId: "", amount: "", date: "", mode: "", remarks: "" });
      fetchStudents(); // update student fees dynamically
      fetchPayments(); // update history
    } catch (error) {
      console.error(error);
      alert("Failed to save payment");
    }
  };

  return (
    <div className="fee-management">
      <div className="fee-header">
        <h2>Fee Management</h2>
        <button className="history-btn" onClick={() => setShowHistory(true)}>
          Payment History
        </button>
      </div>

      {/* Summary Cards */}
      <div className="fee-cards">
        <div className="fee-card">
          Total Collected: ₹
          {students.reduce((acc, s) => acc + s.paidFees, 0)}
        </div>
        <div className="fee-card">
          Pending Fees: ₹
          {students.reduce((acc, s) => acc + (s.totalFees - s.paidFees), 0)}
        </div>
        <div className="fee-card">Total Students: {students.length}</div>
        <div className="fee-card">
          Defaulters: {students.filter((s) => getStatus(s) === "Overdue").length}
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="fee-search"
        placeholder="Search student by name or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Fee Table */}
      <div className="fee-table-container">
        <table className="fee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Course</th>
              <th>Total Fees</th>
              <th>Paid Fees</th>
              <th>Pending Fees</th>
              <th>Due Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students
              .filter(
                (s) =>
                  s.studentName?.toLowerCase().includes(search.toLowerCase()) ||
                  s.studentId?.toLowerCase().includes(search.toLowerCase())
              )
              .map((student) => (
                <tr key={student._id}>
                  <td>{student.studentId}</td>
                  <td>{student.studentName}</td>
                  <td>{student.course}</td>
                  <td>₹{student.totalFees}</td>
                  <td>₹{student.paidFees}</td>
                  <td>₹{student.totalFees - student.paidFees}</td>
                  <td>{student.dueDate?.slice(0, 10)}</td>
                  <td>
                    <span className={`status ${getStatus(student)}`}>
                      {getStatus(student)}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Add Payment Form */}
      <div className="payment-form">
        <h3>Add Payment</h3>
        <form onSubmit={handlePayment}>
          <input
            type="text"
            placeholder="Student ID"
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Amount Paid"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
          />
          <select
            value={form.mode}
            onChange={(e) => setForm({ ...form, mode: e.target.value })}
            required
          >
            <option value="">Select Payment Mode</option>
            <option value="Cash">Cash</option>
            <option value="UPI">UPI</option>
            <option value="Bank">Bank</option>
            <option value="Card">Card</option>
          </select>
          <input
            type="text"
            placeholder="Remarks"
            value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          />
          <button type="submit">Save Payment</button>
        </form>
      </div>

      {/* Payment History Modal */}
      {showHistory && (
        <div className="history-modal">
          <div className="history-content">
            <h3>Payment History</h3>
            <div className="history-table-container">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Mode</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsHistory.length > 0 ? (
                    paymentsHistory.map((p, idx) => (
                      <tr key={idx}>
                        <td>{p.studentId}</td>
                        <td>₹{p.amount}</td>
                        <td>{p.date?.slice(0, 10)}</td>
                        <td>{p.mode}</td>
                        <td>{p.remarks}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: "center" }}>
                        No payments yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button className="close-btn" onClick={() => setShowHistory(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;


// import React, { useState } from "react";
// import "./FeeManagement.css";

// const FeeManagement = () => {
//   const [search, setSearch] = useState("");
//   const [students, setStudents] = useState([
//     {
//       id: "STU101",
//       name: "Rohan Verma",
//       course: "B.Tech CSE",
//       totalFees: 100000,
//       paidFees: 80000,
//       dueDate: "2025-10-01",
//     },
//     {
//       id: "STU102",
//       name: "Aditi Sharma",
//       course: "MBA",
//       totalFees: 120000,
//       paidFees: 120000,
//       dueDate: "2025-09-30",
//     },
//     {
//       id: "STU103",
//       name: "Arjun Singh",
//       course: "B.Sc Physics",
//       totalFees: 60000,
//       paidFees: 30000,
//       dueDate: "2025-09-15",
//     },
//   ]);

//   // Payment form state
//   const [form, setForm] = useState({
//     id: "",
//     amount: "",
//     date: "",
//     mode: "",
//     remarks: "",
//   });

//   // Payment history state
//   const [paymentsHistory, setPaymentsHistory] = useState([]);

//   // Modal toggle
//   const [showHistory, setShowHistory] = useState(false);

//   const today = new Date();

//   // Status logic
//   const getStatus = (student) => {
//     const due = new Date(student.dueDate);
//     if (student.paidFees >= student.totalFees) return "Up-to-date";
//     if (student.paidFees < student.totalFees && today <= due) return "Pending";
//     if (student.paidFees < student.totalFees && today > due) return "Overdue";
//   };

//   // Add Payment
//   const handlePayment = (e) => {
//     e.preventDefault();

//     // Update student fees
//     setStudents((prev) =>
//       prev.map((st) =>
//         st.id === form.id
//           ? { ...st, paidFees: st.paidFees + Number(form.amount) }
//           : st
//       )
//     );

//     // Save to history
//     setPaymentsHistory((prev) => [
//       ...prev,
//       {
//         studentId: form.id,
//         amount: form.amount,
//         date: form.date,
//         mode: form.mode,
//         remarks: form.remarks,
//       },
//     ]);

//     setForm({ id: "", amount: "", date: "", mode: "", remarks: "" });
//   };

//   return (
//     <div className="fee-management">
//       {/* Header with button */}
//       <div className="fee-header">
//         <h2>Fee Management</h2>
//         <button className="history-btn" onClick={() => setShowHistory(true)}>
//           Payment History
//         </button>
//       </div>

//       {/* Summary Cards */}
//       <div className="fee-cards">
//         <div className="fee-card">
//           Total Collected: ₹
//           {students.reduce((acc, s) => acc + s.paidFees, 0)}
//         </div>
//         <div className="fee-card">
//           Pending Fees: ₹
//           {students.reduce((acc, s) => acc + (s.totalFees - s.paidFees), 0)}
//         </div>
//         <div className="fee-card">Total Students: {students.length}</div>
//         <div className="fee-card">
//           Defaulters: {students.filter((s) => getStatus(s) === "Overdue").length}
//         </div>
//       </div>

//       {/* Search */}
//       <input
//         type="text"
//         className="fee-search"
//         placeholder="Search student by name or ID..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       {/* Fee Table */}
//       <div className="fee-table-container">
//         <table className="fee-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Course</th>
//               <th>Total Fees</th>
//               <th>Paid Fees</th>
//               <th>Pending Fees</th>
//               <th>Due Date</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students
//               .filter(
//                 (s) =>
//                   s.name.toLowerCase().includes(search.toLowerCase()) ||
//                   s.id.toLowerCase().includes(search.toLowerCase())
//               )
//               .map((student) => (
//                 <tr key={student.id}>
//                   <td>{student.id}</td>
//                   <td>{student.name}</td>
//                   <td>{student.course}</td>
//                   <td>₹{student.totalFees}</td>
//                   <td>₹{student.paidFees}</td>
//                   <td>₹{student.totalFees - student.paidFees}</td>
//                   <td>{student.dueDate}</td>
//                   <td>
//                     <span className={`status ${getStatus(student)}`}>
//                       {getStatus(student)}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add Payment Form */}
//       <div className="payment-form">
//         <h3>Add Payment</h3>
//         <form onSubmit={handlePayment}>
//           <input
//             type="text"
//             placeholder="Student ID"
//             value={form.id}
//             onChange={(e) => setForm({ ...form, id: e.target.value })}
//             required
//           />
//           <input
//             type="number"
//             placeholder="Amount Paid"
//             value={form.amount}
//             onChange={(e) => setForm({ ...form, amount: e.target.value })}
//             required
//           />
//           <input
//             type="date"
//             value={form.date}
//             onChange={(e) => setForm({ ...form, date: e.target.value })}
//             required
//           />
//           <select
//             value={form.mode}
//             onChange={(e) => setForm({ ...form, mode: e.target.value })}
//             required
//           >
//             <option value="">Select Payment Mode</option>
//             <option value="Cash">Cash</option>
//             <option value="UPI">UPI</option>
//             <option value="Bank">Bank</option>
//             <option value="Card">Card</option>
//           </select>
//           <input
//             type="text"
//             placeholder="Remarks"
//             value={form.remarks}
//             onChange={(e) => setForm({ ...form, remarks: e.target.value })}
//           />
//           <button type="submit">Save Payment</button>
//         </form>
//       </div>

//       {/* Modal for Payment History */}
//       {showHistory && (
//         <div className="history-modal">
//           <div className="history-content">
//             <h3>Payment History</h3>
//             <div className="history-table-container">
//             <table className="history-table">
//               <thead>
//                 <tr>
//                   <th>Student ID</th>
//                   <th>Amount</th>
//                   <th>Date</th>
//                   <th>Mode</th>
//                   <th>Remarks</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {paymentsHistory.length > 0 ? (
//                   paymentsHistory.map((p, index) => (
//                     <tr key={index}>
//                       <td>{p.studentId}</td>
//                       <td>₹{p.amount}</td>
//                       <td>{p.date}</td>
//                       <td>{p.mode}</td>
//                       <td>{p.remarks}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="5" style={{ textAlign: "center" }}>
//                       No payments yet
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//             </div>
//             <button
//               className="close-btn"
//               onClick={() => setShowHistory(false)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FeeManagement;


// import React, { useState } from "react";
// import "./FeeManagement.css";

// const FeeManagement = () => {
//   const [search, setSearch] = useState("");
//   const [students, setStudents] = useState([
//     {
//       id: "STU101",
//       name: "Rohan Verma",
//       course: "B.Tech CSE",
//       totalFees: 100000,
//       paidFees: 80000,
//       dueDate: "2025-10-01",
//     },
//     {
//       id: "STU102",
//       name: "Aditi Sharma",
//       course: "MBA",
//       totalFees: 120000,
//       paidFees: 120000,
//       dueDate: "2025-09-30",
//     },
//     {
//       id: "STU103",
//       name: "Arjun Singh",
//       course: "B.Sc Physics",
//       totalFees: 60000,
//       paidFees: 30000,
//       dueDate: "2025-09-15",
//     },
//   ]);

//   // Payment form state
//   const [form, setForm] = useState({
//     id: "",
//     amount: "",
//     date: "",
//     mode: "",
//     remarks: "",
//   });

//   const today = new Date();

//   // Status logic
//   const getStatus = (student) => {
//     const due = new Date(student.dueDate);
//     if (student.paidFees >= student.totalFees) return "Up-to-date";
//     if (student.paidFees < student.totalFees && today <= due) return "Pending";
//     if (student.paidFees < student.totalFees && today > due) return "Overdue";
//   };

//   // Add Payment
//   const handlePayment = (e) => {
//     e.preventDefault();
//     setStudents((prev) =>
//       prev.map((st) =>
//         st.id === form.id
//           ? { ...st, paidFees: st.paidFees + Number(form.amount) }
//           : st
//       )
//     );
//     setForm({ id: "", amount: "", date: "", mode: "", remarks: "" });
//   };

//   return (
//     <div className="fee-management">
//       <h2>Fee Management</h2>

//       {/* Summary Cards */}
//       <div className="fee-cards">
//         <div className="fee-card">
//           Total Collected: ₹
//           {students.reduce((acc, s) => acc + s.paidFees, 0)}
//         </div>
//         <div className="fee-card">
//           Pending Fees: ₹
//           {students.reduce(
//             (acc, s) => acc + (s.totalFees - s.paidFees),
//             0
//           )}
//         </div>
//         <div className="fee-card">Total Students: {students.length}</div>
//         <div className="fee-card">
//           Defaulters: {students.filter((s) => getStatus(s) === "Overdue").length}
//         </div>
//       </div>

//       {/* Search */}
//       <input
//         type="text"
//         className="fee-search"
//         placeholder="Search student by name or ID..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       {/* Fee Table */}
//       <div className="fee-table-container">
//         <table className="fee-table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Course</th>
//               <th>Total Fees</th>
//               <th>Paid Fees</th>
//               <th>Pending Fees</th>
//               <th>Due Date</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students
//               .filter(
//                 (s) =>
//                   s.name.toLowerCase().includes(search.toLowerCase()) ||
//                   s.id.toLowerCase().includes(search.toLowerCase())
//               )
//               .map((student) => (
//                 <tr key={student.id}>
//                   <td>{student.id}</td>
//                   <td>{student.name}</td>
//                   <td>{student.course}</td>
//                   <td>₹{student.totalFees}</td>
//                   <td>₹{student.paidFees}</td>
//                   <td>₹{student.totalFees - student.paidFees}</td>
//                   <td>{student.dueDate}</td>
//                   <td>
//                     <span className={`status ${getStatus(student)}`}>
//                       {getStatus(student)}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Add Payment Form */}
//       <div className="payment-form">
//         <h3>Add Payment</h3>
//         <form onSubmit={handlePayment}>
//           <input
//             type="text"
//             placeholder="Student ID"
//             value={form.id}
//             onChange={(e) => setForm({ ...form, id: e.target.value })}
//             required
//           />
//           <input
//             type="number"
//             placeholder="Amount Paid"
//             value={form.amount}
//             onChange={(e) => setForm({ ...form, amount: e.target.value })}
//             required
//           />
//           <input
//             type="date"
//             value={form.date}
//             onChange={(e) => setForm({ ...form, date: e.target.value })}
//             required
//           />
//           <select
//             value={form.mode}
//             onChange={(e) => setForm({ ...form, mode: e.target.value })}
//             required
//           >
//             <option value="">Select Payment Mode</option>
//             <option value="Cash">Cash</option>
//             <option value="UPI">UPI</option>
//             <option value="Bank">Bank</option>
//             <option value="Card">Card</option>
//           </select>
//           <input
//             type="text"
//             placeholder="Remarks"
//             value={form.remarks}
//             onChange={(e) => setForm({ ...form, remarks: e.target.value })}
//           />
//           <button type="submit">Save Payment</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default FeeManagement;
