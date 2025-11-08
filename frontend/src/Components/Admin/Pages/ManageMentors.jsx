
import React, { useState,useEffect } from "react";
import "./ManageMentors.css"; // styling alag rakho
import AddMentorForm from "./AddMentorForm";

export default function ManageMentors() {
  // Dummy data for mentors
  const [activeSection, setActiveSection] = useState("table");
  const [mentors, setMentors] = useState([]);


  // Add Mentor dummy handler
  const handleAddMentor = () => {
    setActiveSection("addMentor"); // 👈 ab error nahi aayega
  };
  
  // const handleMentorAdded = (newMentor) => {
  //   setMentors(prev => [...prev, newMentor]); // table update
  //   setActiveSection("table"); // form submit ke baad table wapas
  // };
const handleMentorAdded = (mentor) => {
  const formatted = {
    _id: mentor._id,
    mentorId:mentor.mentorId,
    name: `${mentor.firstName} ${mentor.lastName}`,
    specialization: mentor.specialization,
    experience: mentor.experience + " years",
    active: mentor.active || true,
     password: mentor.password
  };
  setMentors((prev) => [...prev, formatted]);
  setActiveSection("table");
};


  // Delete mentor handler
const handleDeleteMentor = async (id) => {
  try {
    const res = await fetch(`http://localhost:5000/api/mentors/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setMentors((prev) => prev.filter((m) => m._id !== id));
    } else {
      const data = await res.json();
      alert(data.message || "Error deleting mentor");
    }
  } catch (err) {
    console.error(err);
  }
};

const handleToggleStatus = async (id, currentStatus) => {
  try {
    const res = await fetch(`http://localhost:5000/api/mentors/${id}/toggle`, {
      method: "PATCH",
    });
    const data = await res.json();
    if (res.ok) {
      setMentors((prev) =>
        prev.map((m) => (m._id === id ? { ...m, active: !currentStatus } : m))
      );
    } else {
      alert(data.message || "Error updating status");
    }
  } catch (err) {
    console.error(err);
  }
};
useEffect(() => {
  const fetchMentors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/mentors");
      const data = await res.json();
      const formattedData = data.map(mentor => ({
        _id: mentor._id,
        mentorId: mentor.mentorId,
        name: `${mentor.firstName} ${mentor.lastName}`,
        specialization: mentor.specialization,
        experience: mentor.experience + " years",
        active: mentor.active,
        password: mentor.password,
        plainPassword: mentor.plainPassword
         
      }));

      setMentors(formattedData); // data should contain _id, name, specialization, experience
    } catch (err) {
      console.error(err);
    }
  };
  fetchMentors();
}, []);

  return (
    <div className="manage-mentors">
      <h2>Mentor Management</h2>

      {/* Cards Section */}
      <div className="mcards">
        <div className="mcard" onClick={handleAddMentor}>
          <h3>Add Mentor</h3>
          <p>Add a new mentor to the system.</p>
        </div>
        <div className="mcard">
          <h3>Manage Mentors</h3>
          <p>View, edit, or delete mentor details.</p>
        </div>
      </div>
    
    {activeSection === "addMentor" && (
        <AddMentorForm onMentorAdded={handleMentorAdded} />
      )}
      {/* Mentor Table */}
      {activeSection === "table" && (
      <div className="mentors-list">
        <h3>All Mentors</h3>
        <table className="mentors-table">
          <thead>
            <tr>
              <th>Mentor ID</th>
              <th>Name</th>
              <th>Specialization</th>
              <th>Experience</th>
              <th>Password</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mentors.map((mentor) => (
              <tr key={mentor._id}>
                <td>{mentor.mentorId}</td>
                <td>{mentor.name}</td>
                <td>{mentor.specialization}</td>
                <td>{mentor.experience}</td>
                 <td>{mentor.plainPassword}</td>
                <td>
                  <button>Edit</button>
                  <button
                    style={{ marginLeft: "8px" }}
                    onClick={() => handleDeleteMentor(mentor._id)}
                  >
                    Delete
                  </button>
                  <button
                    style={{ marginLeft: "8px" }}
                    onClick={() => handleToggleStatus(mentor._id, mentor.active)}
                  >
                    {mentor.active ? "Deactivate" : "Activate"}
                  </button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}  
