import React, { useState } from "react";
import "./FeePayment.css";

const FeePayment = () => {
  // Sample dynamic data
  const [feeData, setFeeData] = useState({
    totalFee: 50000,
    paidFee: 30000,
    pendingFee: 20000,
    dueDate: "2025-10-10",
    status: "Pending",
  });

  const [paymentHistory, setPaymentHistory] = useState([
    { date: "2025-08-01", amount: 15000, mode: "UPI", remarks: "First Installment", status: "Success" },
    { date: "2025-09-01", amount: 15000, mode: "Card", remarks: "Second Installment", status: "Success" },
  ]);

  const [newPayment, setNewPayment] = useState({
    amount: "",
    mode: "UPI",
    remarks: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setNewPayment({ ...newPayment, [name]: value });
  };

  const handlePay = () => {
    if (!newPayment.amount) return alert("Enter amount!");
    
    const updatedHistory = [
      ...paymentHistory,
      { ...newPayment, status: "Success" },
    ];
    setPaymentHistory(updatedHistory);

    const paidAmount = feeData.paidFee + parseInt(newPayment.amount);
    setFeeData({
      ...feeData,
      paidFee: paidAmount,
      pendingFee: feeData.totalFee - paidAmount,
      status: paidAmount >= feeData.totalFee ? "Up-to-date" : "Pending",
    });

    // Reset form
    setNewPayment({ ...newPayment, amount: "", remarks: "" });
  };

  return (
    <div className="fee-payment-container">
      {/* Fee Summary */}
      <div className="fee-summary-card">
        <h2>Fee Summary</h2>
        <p><strong>Total Fee:</strong> ₹{feeData.totalFee}</p>
        <p><strong>Paid Fee:</strong> ₹{feeData.paidFee}</p>
        <p><strong>Pending Fee:</strong> ₹{feeData.pendingFee}</p>
        <p><strong>Due Date:</strong> {feeData.dueDate}</p>
        <p>
          <strong>Status:</strong>{" "}
          {feeData.status === "Up-to-date" ? "✅ Up-to-date" :
           feeData.status === "Pending" ? "⚠️ Pending" : "❌ Overdue"}
        </p>
      </div>

      {/* Make a Payment */}
      <div className="payment-form">
        <h2>Make a Payment</h2>
        <input
          type="number"
          name="amount"
          value={newPayment.amount}
          onChange={handlePaymentChange}
          placeholder="Enter Amount"
        />
        <select name="mode" value={newPayment.mode} onChange={handlePaymentChange}>
          <option value="UPI">UPI</option>
          <option value="Card">Card</option>
          <option value="Net Banking">Net Banking</option>
          <option value="Cash">Cash</option>
        </select>
        <input
          type="date"
          name="date"
          value={newPayment.date}
          onChange={handlePaymentChange}
        />
        <input
          type="text"
          name="remarks"
          value={newPayment.remarks}
          onChange={handlePaymentChange}
          placeholder="Remarks (optional)"
        />
        <button onClick={handlePay}>Pay</button>
      </div>

      {/* Payment History */}
      <div className="payment-history">
        <h2>Payment History</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Remarks</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((p, index) => (
              <tr key={index}>
                <td>{p.date}</td>
                <td>₹{p.amount}</td>
                <td>{p.mode}</td>
                <td>{p.remarks}</td>
                <td>{p.status === "Success" ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeePayment;

