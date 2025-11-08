// src/components/AdminLeaveDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminLeaveDashboard.css";

const AdminLeaveDashboard = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leaves");
      setLeaveRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/leaves/${id}`, { status });
      fetchLeaves(); // refresh
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  return (
<div className="admin-leave-requests-container">
  <h2 className="admin-dashboard-title">Leave Requests</h2>

  {leaveRequests.length === 0 ? (
    <p className="no-requests-text">No leave requests available.</p>
  ) : (
    <div className="admin-table-wrapper">
      <table className="admin-leave-table">
        <thead>
          <tr className="admin-table-header-row">
            <th className="admin-table-header-cell">Student Name</th>
            <th className="admin-table-header-cell">Leave Type</th>
            <th className="admin-table-header-cell">Start Date</th>
            <th className="admin-table-header-cell">End Date</th>
            <th className="admin-table-header-cell">Reason</th>
            <th className="admin-table-header-cell">Status</th>
            <th className="admin-table-header-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.map((leave, idx) => (
            <tr
              key={leave._id}
              className={`admin-table-row ${idx % 2 === 0 ? "row-even" : "row-odd"}`}
            >
              <td className="admin-table-cell">{leave.studentName}</td>
              <td className="admin-table-cell">{leave.leaveType}</td>
              <td className="admin-table-cell">{leave.startDate}</td>
              <td className="admin-table-cell">{leave.endDate}</td>
              <td className="admin-table-cell">{leave.reason}</td>
              <td
                className={`admin-table-cell admin-status-cell ${
                  leave.status === "Approved"
                    ? "status-approved"
                    : leave.status === "Denied"
                    ? "status-denied"
                    : "status-pending"
                }`}
              >
                {leave.status}
              </td>
              <td className="admin-table-cell admin-action-cell">
                {leave.status === "Pending" && (
                  <>
                    <button
                      className="btn-approve"
                      onClick={() => updateStatus(leave._id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-deny"
                      onClick={() => updateStatus(leave._id, "Denied")}
                    >
                      Deny
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>



  );
};

export default AdminLeaveDashboard;

