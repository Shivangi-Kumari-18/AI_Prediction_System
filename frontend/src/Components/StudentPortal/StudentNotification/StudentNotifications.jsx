import React, { useState, useEffect } from "react";
import "./StudentNotifications.css";

const studentData = {
  name: "Shivangi",
  attendance: 68,
  testScore: 55,
  feeStatus: "pending",
  counsellingSchedule: [
    { id: 1, date: "2025-09-28", time: "10:00 AM", topic: "Attendance Improvement", details: "Discuss strategies to improve attendance and participation in classes." },
    { id: 2, date: "2025-09-30", time: "2:00 PM", topic: "Test Score Guidance", details: "Plan extra practice sessions and mock tests to improve scores." },
  ],
};

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const generatedNotifications = [];

    if (studentData.attendance < 75) {
      generatedNotifications.push({
        id: 1,
        message: `Your attendance is low (${studentData.attendance}%). Please improve!`,
        details: "Your attendance is below the required 75%. You are advised to attend all remaining classes to avoid issues.",
        type: "alert",
      });
    }

    if (studentData.testScore < 60) {
      generatedNotifications.push({
        id: 2,
        message: `Your latest test score is ${studentData.testScore}. Consider extra practice.`,
        details: "The last test score indicates the need for improvement. Join tutoring sessions or extra practice classes.",
        type: "warning",
      });
    }

    if (studentData.feeStatus === "pending") {
      generatedNotifications.push({
        id: 3,
        message: "Your fee is pending. Please pay to avoid penalties.",
        details: "Pending fees must be cleared before next month to avoid fines or restricted access.",
        type: "info",
      });
    }

    studentData.counsellingSchedule.forEach((counselling) => {
      generatedNotifications.push({
        id: `c-${counselling.id}`,
        message: `Counselling on ${counselling.date} at ${counselling.time} - Topic: ${counselling.topic}`,
        details: counselling.details,
        type: "counselling",
      });
    });

    setNotifications(generatedNotifications);
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="notifications-list">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p className="no-notifications">No notifications</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li
              key={notif.id}
              className={`notification ${notif.type} ${expandedId === notif.id ? "expanded" : ""}`}
              onClick={() => toggleExpand(notif.id)}
            >
              <div className="message">{notif.message}</div>
              {expandedId === notif.id && <div className="details">{notif.details}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentNotifications;


