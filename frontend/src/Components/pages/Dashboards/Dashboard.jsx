



import React, { useState, useEffect, useMemo } from "react";
import "./Dashboard.css";
import * as XLSX from "xlsx";
import Notepad from "../Notepads/Notepad";
import axios from "axios";
import Counselling from "../Counsellings/Counselling";
import Student from "../Students/Student";
import Attendances from "../../../Components/Attendances/Attendances";
import TestScores from "../Grades/SemesterScore";
import CounsellingDashboard from "../Counsellings/CounsellingDashboard";
import { useNavigate } from "react-router-dom";
import Counsellor from "../Counsellings/Counsellor";
import Notification from "../Notification/Notification";
import SelectScore from "../Grades/SelectScore";
import SemesterScore from "../Grades/SemesterScore";
import ClassScore from "../Grades/ClassScore"; 




const MODEL_FEATURES = [
  "Student ID",
  "Marital Status",
  "Application mode",
  "Application order",
  "Course",
  "Daytime/evening attendance",
  "Previous qualification",
  "Previous qualification (grade)",
  "Nacionality",
  "Mother's qualification",
  "Father's qualification",
  "Mother's occupation",
  "Father's occupation",
  "Admission grade",
  "Displaced",
  "Educational special needs",
  "Debtor",
  "Tuition fees up to date",
  "Gender",
  "Scholarship holder",
  "Age at enrollment",
  "International",
  "Curricular units 1st sem (credited)",
  "Curricular units 1st sem (enrolled)",
  "Curricular units 1st sem (evaluations)",
  "Curricular units 1st sem (approved)",
  "Curricular units 1st sem (grade)",
  "Curricular units 1st sem (without evaluations)",
  "Curricular units 2nd sem (credited)",
  "Curricular units 2nd sem (enrolled)",
  "Curricular units 2nd sem (evaluations)",
  "Curricular units 2nd sem (approved)",
  "Curricular units 2nd sem (grade)",
  "Curricular units 2nd sem (without evaluations)",
  "Unemployment rate",
  "Inflation rate",
  "GDP",
];

const sendAllHighRiskAlerts = async (students) => {
  if (!students || students.length === 0) {
    alert("⚠️ No high-risk students found!");
    return;
  }

  try {
    // Build payload as array
    const payload = students.map((student) => ({
      studentName: student.name,
      studentId: student.student_id,
      course: student.course,
      email: student.email, // optional, if needed for backend logging
    }));

    console.log("🚀 Sending bulk payload:", payload);

    await axios.post(
      "http://127.0.0.1:5000/api/mentor-notify/send-alert",
      { students: payload }, // batch payload
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert(`✅ Mentor notified with ${students.length} high-risk students!`);
  } catch (err) {
    console.error("❌ Mentor bulk notification error:", err);
    alert("❌ Failed to send bulk notification.");
  }
};

const sampleStudents = [];

function parseExcel(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(sheet, {
      defval: "",
      raw: false,
    });

    // ✅ Ensure all MODEL_FEATURES are mapped
    const parsed = jsonData.map((row) => {
      const normalizedRow = {};

      MODEL_FEATURES.forEach((col) => {
        normalizedRow[col] = row[col] ?? ""; // bas direct header le lo
      });

      // UI-friendly / stable keys for frontend
      normalizedRow["Student ID"] =
        row["Student ID"] ?? row["student id"] ?? row["id"] ?? null;
      normalizedRow["student_id"] = normalizedRow["Student ID"]; // keep both keys
      normalizedRow["name"] =
        row["Name"] ?? row["name"] ?? row["Full Name"] ?? "Unknown";
      normalizedRow["course"] = row["Course"] ?? row["course"] ?? "";
      normalizedRow["contributing_factor"] =
        row["contributing_factor"] ?? row["factor"] ?? "Other";
      normalizedRow["email"] = row["Email"] ?? row["email"] ?? "";



      return normalizedRow;
    });

    callback(parsed);
  };

  reader.readAsArrayBuffer(file);
}

const RiskBadge = ({ level }) => {
  const cls =
    level === "High"
      ? "badge-high"
      : level === "Moderate"
      ? "badge-moderate"
      : "badge-low";
  return <span className={`risk-badge ${cls}`}>{level}</span>;
};

const Dashboard = () => {
  const [students, setStudents] = useState(sampleStudents);
  const [filter, setFilter] = useState("");
  // const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard" or "counselling"
  const [activeTab, setActiveTab] = useState(() => {
  return localStorage.getItem("activeTab") || "dashboard";
});

  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate(); 

  const [counsellingList, setCounsellingList] = useState([]);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
  const savedStudents = localStorage.getItem("students");
  const savedTab = localStorage.getItem("activeTab");
  const savedCounselling = localStorage.getItem("counsellingList");

  // if (savedStudents) setStudents(JSON.parse(savedStudents));
  if (savedTab) setActiveTab(savedTab);
  // if (savedCounselling) setCounsellingList(JSON.parse(savedCounselling));

//    if (savedStudents) {
//   const parsed = JSON.parse(savedStudents);
//   setStudents(parsed);

//   // counselling list students ke andar se hi nikaal lo
//   const counsellingFromStudents = parsed.filter(s => s.marked === true || s.status === "Pending");
//   setCounsellingList(counsellingFromStudents);
// }
    if (savedStudents) {
  const parsed = JSON.parse(savedStudents);
  setStudents(parsed);
}

// agar savedCounselling mila hai to wahi use karo
  if (savedCounselling) {
    setCounsellingList(JSON.parse(savedCounselling));
  }

 

}, []);

   // 🔹 Jab students badle to localStorage me save ho
  // useEffect(() => {
  //   localStorage.setItem("students", JSON.stringify(students));
  // }, [students]);

//savesstudent

//   useEffect(() => {
//   const savedStudents = localStorage.getItem("students");
//   if (savedStudents) setStudents(JSON.parse(savedStudents));
// }, []);


  // 🔹 ActiveTab aur Counselling list save
  // useEffect(() => {
  //   localStorage.setItem("activeTab", activeTab);
  // }, [activeTab]);
  useEffect(() => {
  if (activeTab) {
    localStorage.setItem("activeTab", activeTab);
  }
}, [activeTab]);


  // useEffect(() => {
  //   localStorage.setItem("counsellingList", JSON.stringify(counsellingList));
  // }, [counsellingList]);

  useEffect(() => {
  if (counsellingList.length > 0) {
    localStorage.setItem("counsellingList", JSON.stringify(counsellingList));
  }
}, [counsellingList]);

  // ...tumhara baaki pura code same rahega (return wala part bhi)


  //   useEffect(() => {
  //   const fetchStudents = async () => {
  //     try {
  //       const res = await axios.get("http://localhost:5000/students"); // replace with your actual backend route
  //       setStudents(res.data);
  //     } catch (err) {
  //       console.error("Failed to fetch students:", err);
  //     }
  //   };
  //   fetchStudents();
  // }, []);

  const totals = useMemo(() => {
    const total = students.length;
    const aiRisk = students.filter(
      (s) => s.risk === "High" || s.risk === "Moderate"
    ).length;
    const dropped = students.filter((s) => /drop/i.test(s.status)).length;
    const counselling = students.filter(
      (s) => /counsel/i.test(s.status) || /ongoing/i.test(s.status)
    ).length;
    return { total, aiRisk, dropped, counselling };
  }, [students]);

  const highRiskStudents = useMemo(
    () => students.filter((s) => s.risk === "High"),
    [students]
  );

  const factorCounts = useMemo(() => {
    const count = {};
    students.forEach((s) => {
      const f = s.contributing_factor || "Other";
      count[f] = (count[f] || 0) + 1;
    });

    // convert to array and take top 5
    return Object.entries(count)
      .map(([factor, val]) => ({ factor, val }))
      .sort((a, b) => b.val - a.val)
      .slice(0, 5);
  }, [students]);

  // Sort students by dropout probability descending
  const sortedStudents = useMemo(() => {
    return [...students].sort(
      (a, b) => (b.dropout_probability ?? 0) - (a.dropout_probability ?? 0)
    );
  }, [students]);

  // Apply search filter
  const filteredAndSorted = sortedStudents.filter((s) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.dept || "").toLowerCase().includes(q) ||
      (s.semester || "").toLowerCase().includes(q)
    );
  });

  // --- Upload Excel (replace current data) ---
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const fileExt = file.name.split(".").pop();
    if (!["xlsx", "xls"].includes(fileExt)) {
      alert("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    parseExcel(file, async (parsed) => {
      if (parsed.length === 0) {
        alert("Excel file is empty or missing required headers.");
        return;
      }

      // Normalize Excel headers
      const normalize = (s) => s.trim().toLowerCase();
      // Filter only model features
      const filteredData = parsed.map((row) => {
        const filteredRow = {};
        MODEL_FEATURES.forEach((col) => {
          // filteredRow[col] = row[col] ?? "";
          filteredRow[col] = row[col] ?? row[col.toLowerCase()] ?? "";
        });

        filteredRow["student_id"] =
          row["Student ID"] ?? row["student id"] ?? row["id"] ?? null;
        filteredRow["email"] = row["Email"] ?? row["email"] ?? ""; // ✅ add email

        return filteredRow;
      });
      console.log("Filtered Data Sent to Backend:", filteredData);
      try {
        const response = await axios.post("http://127.0.0.1:8000/predict", {
          records: filteredData,
        });

        const { results } = response.data;

        const merged = parsed.map((student, idx) => {
          const r = results[idx];
          const prob = r?.dropout_probability ?? 0; // ✅ correct field name
          let risk = "Low";
          if (prob >= 70) risk = "High";
          else if (prob >= 40) risk = "Moderate";

          return {
            ...student,
            prediction: r?.prediction ?? "N/A",
            dropout_probability: prob,
            explanations: r.explanations ?? [], // keep explanations
            risk,
          };
        });

        setStudents(merged);
        localStorage.setItem("students", JSON.stringify(merged));

        // ✅ Counselling list ko bhi naya students ke saath sync karo
        const updatedCounselling = merged.filter(s => s.marked === true || s.status === "Pending");
        setCounsellingList(updatedCounselling);
        localStorage.setItem("counsellingList", JSON.stringify(updatedCounselling));


      } catch (err) {
        console.error(err);
        alert("Error sending data to backend.");
      }

      // Inside handleFile / prediction result ke baad
      const highRiskStudents = filteredData.filter((s) => s.risk === "risk");

      for (const student of highRiskStudents) {
        await fetch("http://localhost:5000/api/mentor-notify/send-alert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // AuthContext se token
          },
          body: JSON.stringify({
            studentName: student.name,
            studentEmail: student.email,
            sentBy: user.id, // AuthContext se user.id
          }),
        });
      }

      //Auto send mail
      // inside handleFile (after setStudents(merged);)
    });
  };

  // --- Append Excel data to existing table ---
  const handleAppendFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileExt = file.name.split(".").pop();
    if (!["xlsx", "xls"].includes(fileExt)) {
      alert("Please upload a valid Excel file (.xlsx or .xls)");
      return;
    }

    parseExcel(file, async (parsed) => {
      if (parsed.length === 0) {
        alert("Excel file is empty or missing required headers.");
        return;
      }

      // Filter only model features (for backend)
      const filteredData = parsed.map((row) => {
        const filteredRow = {};
        MODEL_FEATURES.forEach((col) => {
          filteredRow[col] = row[col] ?? row[col.toLowerCase()] ?? "";
        });
        filteredRow["student_id"] =
          row["Student ID"] ?? row["student id"] ?? row["id"] ?? null;
        return filteredRow;
      });

      try {
        const response = await axios.post("http://127.0.0.1:8000/predict", {
          records: filteredData,
        });
        const { results } = response.data;

        // ✅ Merge predictions + preserve name/course like in handleFile
        const merged = parsed.map((student, idx) => {
          const r = results[idx];
          const prob = r?.dropout_probability ?? 0;
          let risk = "Low";
          if (prob >= 70) risk = "High";
          else if (prob >= 40) risk = "Moderate";

          return {
            ...student, // keep parsed name, course etc.
            prediction: r?.prediction ?? "N/A",
            dropout_probability: prob,
            explanations: r?.explanations ?? [],
            risk,
          };
        });

        // ✅ Append to existing students
        setStudents((prev) => {
        const updated = [...prev, ...merged];
        localStorage.setItem("students", JSON.stringify(updated));
        return updated;
      });

      } catch (err) {
        console.error(err);
        alert("Error sending data to backend.");
      }
    });
  };
  const handleMarkForCounselling = (student) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.student_id === student.student_id ? { ...s, marked: true } : s
      )
    );

    // setCounsellingList((prev) => {
    //   if (prev.find((s) => s.student_id === student.student_id)) return prev;
    //   return [
    //     ...prev,
    //     { ...student, marked: true, status: "Pending", session: null },
    //   ];
    // });
    setCounsellingList((prev) => {
      if (prev.find((s) => s.student_id === student.student_id)) return prev;

      const updated = [
        ...prev,
        { ...student, marked: true, status: "Pending", session: null },
      ];
      localStorage.setItem("counsellingList", JSON.stringify(updated)); // ✅ save karo
      return updated;
    });



  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <nav>
          <button
            className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            Dashboard
          </button>

          {/* <button
            className={`nav-btn ${activeTab === "counselling" ? "active" : ""}`}
            onClick={() => setActiveTab("counselling")}
          >
            Counseling
          </button> */}
          <button
            className={`nav-btn ${activeTab === "counselling-dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("counselling-dashboard")}
          >
            Counselling
          </button>
          <button
            className={`nav-btn ${activeTab === "students" ? "active" : ""}`}
            onClick={() => setActiveTab("students")}
          >
            Students
          </button>

          <button
            className={`nav-btn ${activeTab === "notepad" ? "active" : ""}`}
            onClick={() => setActiveTab("notepad")}
          >
            Notepad
          </button>

          <button
            className={`nav-btn ${activeTab === "attendances" ? "active" : ""}`}
            onClick={() => setActiveTab("attendances")}
          >
            Attendances
          </button>

          <button
            className={`nav-btn ${activeTab === "test-scores" ? "active" : ""}`}
            onClick={() => setActiveTab("test-scores")}
          >
            Test Scores        
          </button>
          <button
            className={`nav-btn ${activeTab === "notification" ? "active" : ""}`}
            onClick={() => setActiveTab("notification")}
          >
            Notification        
          </button>


          <button className="nav-btn">Settings</button>
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="left-top">
            {/* <h1 className="site-title">Node Link</h1> */}

            {activeTab === "dashboard" && (
              <div className="search-wrap">
                <input
                  type="search"
                  placeholder="Search student..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>
            )}
          </div>
        </header>

        {activeTab === "dashboard" && (
          <section className="dashboard-grid">
            <div className="cards-row">
              <div className="card stat-card">
                <div className="stat-label">Total Students</div>
                <div className="stat-value">{totals.total}</div>
              </div>
                <div className="card stat-card">
                <div className="stat-label">AI-Risk Students</div>
                <div className="stat-value">
                {students.filter((s) => s.risk === "High").length}
              </div>
              </div>
              <div className="card stat-card">
                <div className="stat-label">Dropped-Out Students</div>
                <div className="stat-value">{totals.dropped}</div>
              </div>
              <div className="card stat-card">
                <div className="stat-label">Ongoing Counseling</div>
                <div className="stat-value">{totals.counselling}</div>
              </div>
            </div>

            <div className="grid-two-col">
              <div className="card risk-list-card">
                <div className="card-header">
                  <h3>Dropout Risk List</h3>
                  <div className="upload-controls">
                    <label className="btn upload-btn">
                      Upload Excel file
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFile}
                      />
                    </label>
                    <label className="btn append-btn">
                      Update Excel file
                      <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleAppendFile}
                      />
                    </label>
                  </div>
                </div>
              <div className="table-container">
                <table className="risk-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Student ID</th>
                      <th>Course</th>
                      <th>Risk Level</th>
                      {/* <th>Prediction</th> */}
                      <th>Dropout Probability</th>
                      <th>
                        <button
                          className="notify-btn"
                          onClick={() =>
                            sendAllHighRiskAlerts(highRiskStudents)
                          }
                        >
                          🚨 Notify ALL
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSorted.map((s, idx) => (
                      <tr key={idx}>
                        <td>{s.name}</td>
                        <td>{s.student_id || "N/A"}</td>
                        <td>{s.course}</td>
                        <td>
                          <RiskBadge level={s.risk} />
                        </td>
                        {/* <td>{s.prediction}</td> */}
                        <td>{s.dropout_probability?.toFixed(2) ?? "N/A"}</td>
                        <td>
                          {s.risk === "High" && (
                            <button className="notify-btn">🚨 Notify</button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filteredAndSorted.length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          style={{ textAlign: "center", padding: "20px" }}
                        >
                          No students found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
                
              </div>
              <div className="card notifications-card">
                <h3>Notifications 🔔</h3>
                <div className="notif-container">
                  {highRiskStudents.length === 0 && (
                    <div className="note">No high-risk notifications</div>
                  )}
                  {highRiskStudents.slice(0, 5).map((s, idx) => (
                    <div key={idx} className="notification-item">
                      <div className="notif-dot high" />
                      <div className="notif-text">
                        <strong>{s.name}</strong> added to high-risk list
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
              <div className="card summary-card">
                <h3>Institute Summary</h3>
                <div className="summary-list">
                  <div className="summary-line">
                    <span>Total Departments</span>
                    <strong>4</strong>
                  </div>
                  <div className="summary-line">
                    <span>Semesters</span>
                    <strong>8</strong>
                  </div>
                  <div className="summary-line">
                    <span>Dropout Percentage</span>
                    <strong>2%</strong>
                  </div>
                  <div className="summary-line">
                    <span>Quick Filter</span>
                    <strong>2</strong>
                  </div>
                </div>
              </div>
            {/* </div> */}
          </section>
        )}

        {activeTab === "counselling-dashboard" && (
          <CounsellingDashboard
            onSelectCounselling={() => setActiveTab("counselling")}
            onGiveCounselling={() => setActiveTab("counsellor")}
          />
        )}

        {activeTab === "counselling" && (
          <Counselling students={counsellingList || []}
          goBack={() => setActiveTab("counselling-dashboard")} />
        )}
        {activeTab === "counsellor" && (
          <Counsellor  students={counsellingList} 
          goBack={() => setActiveTab("counselling-dashboard")} />
        )}


        {activeTab === "notepad" && (
          <section className="notepad-page">
            <Notepad /> 
          </section>
        )}

        {activeTab === "attendances" && <Attendances studentData={students } subjects={["Math", "Physics", "Chemistry"]}/>}
        {/* {activeTab === "test-scores" && <SelectScore students={students} />} */}

        {activeTab === "test-scores" && (
          <SelectScore
            onSelectClass={() => setActiveTab("class-score")}
            onSelectSemester={() => setActiveTab("semester-score")}
          />
        )}

        {activeTab === "class-score" && (
          <ClassScore 
            students={students} 
            goBack={() => setActiveTab("test-scores")} 
          />
        )}

        {activeTab === "semester-score" && (
          <SemesterScore 
            students={students} 
            goBack={() => setActiveTab("test-scores")} 
          />
        )}




        {activeTab === "students" && (
          <Student
            studentData={students}
            onMarkForCounselling={handleMarkForCounselling}
            goBack={() => setActiveTab("dashboard")}
          />
        )}
         {activeTab === "notification" && <Notification />}
      
      </main>
    </div>
  );
};

export default Dashboard;





