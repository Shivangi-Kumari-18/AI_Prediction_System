// import React, { useState } from "react";
// import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
// import "./Attendance.css";

// const Attendance = () => {
//   // Sample summary data
//   const [attendanceData, setAttendanceData] = useState([
//     { name: "Present", value: 75 },
//     { name: "Absent", value: 25 },
//   ]);
//   const COLORS = ["#4CAF50", "#E74C3C"];

//   const monthlyAttendance = [
//     { month: "Jan", present: 20, absent: 2 },
//     { month: "Feb", present: 18, absent: 4 },
//     { month: "Mar", present: 22, absent: 0 },
//     { month: "Apr", present: 19, absent: 3 },
//   ];

//   // Sample daily attendance for calendar (format: 'YYYY-MM-DD')
//   const [dailyAttendance, setDailyAttendance] = useState({
//     "2025-09-01": "present",
//     "2025-09-02": "absent",
//     "2025-09-03": "present",
//     "2025-09-04": "present",
//     "2025-09-05": "absent",
//     "2025-09-06": "present",
//     "2025-09-07": "present",
//     "2025-09-08": "absent",
//   });

//   // Calendar generation
//   const getDaysInMonth = (month, year) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const today = new Date();
//   const year = today.getFullYear();
//   const month = today.getMonth(); // 0-based
//   const daysInMonth = getDaysInMonth(month, year);

//   const calendarDays = [];
//   for (let day = 1; day <= daysInMonth; day++) {
//     const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
//     const status = dailyAttendance[dateStr] || "none";
//     calendarDays.push({ day, status });
//   }

//   return (
//     <div className="attendance-container">
//       {/* Attendance Summary */}
//       <div className="attendance-summary">
//         <h2>Attendance Overview</h2>
//         <div className="summary-items">
//           <div className="summary-item">
//             <strong>Total Days Present:</strong> {attendanceData[0].value}
//           </div>
//           <div className="summary-item">
//             <strong>Total Days Absent:</strong> {attendanceData[1].value}
//           </div>
//           <div className="summary-item">
//             <strong>Attendance Percentage:</strong>{" "}
//             {((attendanceData[0].value / (attendanceData[0].value + attendanceData[1].value)) * 100).toFixed(1)}%
//           </div>
//         </div>
//       </div>

//       {/* Attendance Pie Chart */}
//       <div className="attendance-main-row">

      
      

//       {/* Monthly Attendance Table */}
//       <div className="attendance-table">
//         <h3>Monthly Attendance</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>Month</th>
//               <th>Days Present</th>
//               <th>Days Absent</th>
//             </tr>
//           </thead>
//           <tbody>
//             {monthlyAttendance.map((m, index) => (
//               <tr key={index}>
//                 <td>{m.month}</td>
//                 <td>{m.present}</td>
//                 <td>{m.absent}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="attendance-calendar">
//         <h3>Attendance Calendar ({today.toLocaleString("default", { month: "long" })} {year})</h3>
//         <div className="calendar-grid">
//           {calendarDays.map((d, index) => (
//             <div
//               key={index}
//               className={`calendar-day ${d.status}`}
//               title={`${d.day} - ${d.status}`}
//             >
//               {d.day}
//             </div>
//           ))}
//         </div>
//         <div className="calendar-legend">
//           <span className="present-box"></span> Present
//           <span className="absent-box"></span> Absent
//         </div>
//       </div>
//       </div>

      
      
//     </div>
//   );
// };

// export default Attendance;

// import React, { useState } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts";
// import "./Attendance.css";

// const Attendance = () => {
//   // Sample summary data
//   const [attendanceData, setAttendanceData] = useState([
//     { name: "Present", value: 75 },
//     { name: "Absent", value: 25 },
//   ]);
//   const COLORS = ["#4CAF50", "#E74C3C"];

//   // Monthly Attendance Data
//   const monthlyAttendance = [
//     { month: "Jan", present: 20, absent: 2 },
//     { month: "Feb", present: 18, absent: 4 },
//     { month: "Mar", present: 22, absent: 0 },
//     { month: "Apr", present: 19, absent: 3 },
//   ];

//   // Sample daily attendance for calendar
//   const [dailyAttendance, setDailyAttendance] = useState({
//     "2025-09-01": "present",
//     "2025-09-02": "absent",
//     "2025-09-03": "present",
//     "2025-09-04": "present",
//     "2025-09-05": "absent",
//     "2025-09-06": "present",
//     "2025-09-07": "present",
//     "2025-09-08": "absent",
//   });

//   // Calendar generation
//   const getDaysInMonth = (month, year) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const today = new Date();
//   const year = today.getFullYear();
//   const month = today.getMonth(); // 0-based
//   const daysInMonth = getDaysInMonth(month, year);

//   const calendarDays = [];
//   for (let day = 1; day <= daysInMonth; day++) {
//     const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
//       day
//     ).padStart(2, "0")}`;
//     const status = dailyAttendance[dateStr] || "none";
//     calendarDays.push({ day, status });
//   }

//   return (
//     <div className="attendance-container">
//       {/* Attendance Summary */}
//       <div className="attendance-summary">
//         <h2>Attendance Overview</h2>
//         <div className="summary-items">
//           <div className="summary-item">
//             <strong>Total Days Present:</strong> {attendanceData[0].value}
//           </div>
//           <div className="summary-item">
//             <strong>Total Days Absent:</strong> {attendanceData[1].value}
//           </div>
//           <div className="summary-item">
//             <strong>Attendance Percentage:</strong>{" "}
//             {(
//               (attendanceData[0].value /
//                 (attendanceData[0].value + attendanceData[1].value)) *
//               100
//             ).toFixed(1)}
//             %
//           </div>
//         </div>
//       </div>

//       {/* Attendance Main Section */}
//       <div className="attendance-main-row">
//         {/* Pie Chart */}
//         <div className="attendance-pie">
//           <h3>Attendance Distribution</h3>
//           <PieChart width={300} height={250}>
//             <Pie
//               data={attendanceData}
//               cx="50%"
//               cy="50%"
//               labelLine={false}
//               outerRadius={80}
//               fill="#8884d8"
//               dataKey="value"
//               label
//             >
//               {attendanceData.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </div>

//         {/* Monthly Attendance Table */}
//         <div className="attendance-table">
//           <h3>Monthly Attendance</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>Month</th>
//                 <th>Days Present</th>
//                 <th>Days Absent</th>
//               </tr>
//             </thead>
//             <tbody>
//               {monthlyAttendance.map((m, index) => (
//                 <tr key={index}>
//                   <td>{m.month}</td>
//                   <td>{m.present}</td>
//                   <td>{m.absent}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Attendance Trend Graph */}
//       <div className="attendance-trend">
//         <h3>📈 Attendance Trend (Monthly)</h3>
//         <LineChart
//           width={600}
//           height={300}
//           data={monthlyAttendance}
//           margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="present"
//             stroke="#4CAF50"
//             strokeWidth={2}
//           />
//           <Line
//             type="monotone"
//             dataKey="absent"
//             stroke="#E74C3C"
//             strokeWidth={2}
//           />
//         </LineChart>
//       </div>

//       {/* Attendance Calendar */}
//       <div className="attendance-calendar">
//         <h3>
//           Attendance Calendar ({today.toLocaleString("default", { month: "long" })}{" "}
//           {year})
//         </h3>
//         <div className="calendar-grid">
//           {calendarDays.map((d, index) => (
//             <div
//               key={index}
//               className={`calendar-day ${d.status}`}
//               title={`${d.day} - ${d.status}`}
//             >
//               {d.day}
//             </div>
//           ))}
//         </div>
//         <div className="calendar-legend">
//           <span className="present-box"></span> Present
//           <span className="absent-box"></span> Absent
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Attendance;








import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./Attendance.css";

const Attendance = () => {
  // Pie Chart Data
  const [attendanceData] = useState([
    { name: "Present", value: 75 },
    { name: "Absent", value: 25 },
  ]);
  const COLORS = ["#4CAF50", "#E74C3C"];

  // Monthly Data
  const monthlyAttendance = [
    { month: "Jan", present: 20, absent: 2 },
    { month: "Feb", present: 18, absent: 4 },
    { month: "Mar", present: 22, absent: 0 },
    { month: "Apr", present: 19, absent: 3 },
  ];

  // Weekly Data
  const weeklyAttendance = [
    { week: "Week 1", present: 5, absent: 2 },
    { week: "Week 2", present: 6, absent: 1 },
    { week: "Week 3", present: 7, absent: 0 },
    { week: "Week 4", present: 6, absent: 1 },
  ];

  // Toggle state
  const [trendType, setTrendType] = useState("monthly");

  // Calendar Data
  const [dailyAttendance] = useState({
    "2025-09-01": "present",
    "2025-09-02": "absent",
    "2025-09-03": "present",
    "2025-09-04": "present",
    "2025-09-05": "absent",
    "2025-09-06": "present",
    "2025-09-07": "present",
    "2025-09-08": "absent",
  });

  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-based
  const daysInMonth = getDaysInMonth(month, year);

  const calendarDays = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const status = dailyAttendance[dateStr] || "none";
    calendarDays.push({ day, status });
  }

  return (
    <div className="attendance-container">
      {/* Attendance Summary */}
      <div className="attendance-summary">
        <h2>Attendance Overview</h2>
        <div className="summary-items">
          <div className="summary-item">
            <strong>Total Days Present:</strong> {attendanceData[0].value}
          </div>
          <div className="summary-item">
            <strong>Total Days Absent:</strong> {attendanceData[1].value}
          </div>
          <div className="summary-item">
            <strong>Attendance Percentage:</strong>{" "}
            {(
              (attendanceData[0].value /
                (attendanceData[0].value + attendanceData[1].value)) *
              100
            ).toFixed(1)}
            %
          </div>
        </div>
      </div>

      {/* Attendance Main Row */}
      <div className="attendance-main-row">
        {/* Pie Chart */}
        <div className="attendance-pie">
          <h3>Attendance Distribution</h3>
          <PieChart width={300} height={250}>
            <Pie
              data={attendanceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {attendanceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

              <div className="attendance-trend">
        <div className="trend-header">
          <h3>
            📈 Attendance Trend ({trendType === "monthly" ? "Monthly" : "Weekly"})
          </h3>
          <button
            className="toggle-btn"
            onClick={() =>
              setTrendType(trendType === "monthly" ? "weekly" : "monthly")
            }
          >
            Switch to {trendType === "monthly" ? "Weekly" : "Monthly"}
          </button>
        </div>

        <LineChart
          width={600}
          height={300}
          data={trendType === "monthly" ? monthlyAttendance : weeklyAttendance}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={trendType === "monthly" ? "month" : "week"} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="present"
            stroke="#4CAF50"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="absent"
            stroke="#E74C3C"
            strokeWidth={2}
          />
        </LineChart>
      </div>

        {/* Monthly Attendance Table */}
        {/* <div className="attendance-table">
          <h3>Monthly Attendance</h3>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Days Present</th>
                <th>Days Absent</th>
              </tr>
            </thead>
            <tbody>
              {monthlyAttendance.map((m, index) => (
                <tr key={index}>
                  <td>{m.month}</td>
                  <td>{m.present}</td>
                  <td>{m.absent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      </div>

      <div className="attendance-trend-calendar-row">


      {/* Calendar */}
      <div className="attendance-calendar">
        <h3>
          Attendance Calendar ({today.toLocaleString("default", { month: "long" })}{" "}
          {year})
        </h3>
        <div className="calendar-grid">
          {calendarDays.map((d, index) => (
            <div
              key={index}
              className={`calendar-day ${d.status}`}
              title={`${d.day} - ${d.status}`}
            >
              {d.day}
            </div>
          ))}
        </div>
        <div className="calendar-legend">
          <span className="present-box"></span> Present
          <span className="absent-box"></span> Absent
        </div>
      </div>
    </div>
    </div>
  );
};

export default Attendance;



