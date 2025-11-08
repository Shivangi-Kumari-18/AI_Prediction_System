import React from "react";
import "./Dashnavbar.css";

const Dashnavbar = () => {
  return (
    <div className="dashnavbar">
      <input type="text" placeholder="Search student..." />
      <div className="login-section">
        <span>Login</span>
        <div className="avatar">👤</div>
      </div>
    </div>
  );
};

export default Dashnavbar;
