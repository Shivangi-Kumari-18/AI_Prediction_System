import React, { useState, useEffect } from "react";
import "./Notification.css"; // optional: styling

// Sample initial notifications
const initialNotifications = [
  { id: 1, name: "Aalok Kumar Pal", risk: "High", probability: 85 },
  { id: 2, name: "Ruhi Agrawal", risk: "Moderate", probability: 60 },
  { id: 3, name: "Aman Singh", risk: "High", probability: 90 },
];

const riskColor = {
  High: "red",
  Moderate: "orange",
  Low: "green",
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  // Load notifications from localStorage or use initial
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notifications"));
    if (stored && stored.length) {
      setNotifications(stored);
    } else {
      setNotifications(initialNotifications);
      localStorage.setItem(
        "notifications",
        JSON.stringify(initialNotifications)
      );
    }
  }, []);

  const markAsRead = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  const notifyAll = () => {
    alert(
      `✅ Sending alerts for ${notifications.length} high-risk students!`
    );
  };

  return (
    <div className="notifications-container">
      <h3>High-Risk Alerts</h3>
      {notifications.length === 0 && (
        <div className="no-notifications">No notifications</div>
      )}
      {notifications.map((n) => (
        <div key={n.id} className="notification-card">
          <div className="notif-info">
            <span className="notif-name">{n.name}</span>
            <span
              className="notif-risk"
              style={{ backgroundColor: riskColor[n.risk] }}
            >
              {n.risk}
            </span>
            <span className="notif-prob">{n.probability}%</span>
          </div>
          <div className="notif-actions">
            <button onClick={() => alert(`View details for ${n.name}`)}>
              View Details
            </button>
            <button onClick={() => markAsRead(n.id)}>Mark Read</button>
          </div>
        </div>
      ))}

      {notifications.length > 0 && (
        <button className="notify-all-btn" onClick={notifyAll}>
          Notify All High-Risk Students
        </button>
      )}
    </div>
  );
};

export default Notifications;
