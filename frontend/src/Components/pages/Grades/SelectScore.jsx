import React from "react";
import { FaBook, FaClipboardList } from "react-icons/fa"; // react-icons import
import "./SelectScore.css";

const ScoreBoxes = ({ onSelectClass, onSelectSemester }) => {
  return (
    <div className="score-container">
      {/* Box 1 - Class Test / Regular Test */}
      <div className="score-box">
        <FaClipboardList className="score-icon" />
        <h3>Class Test / Regular Test Score</h3>
        <p>Manage and record test scores of students here.</p>
        <button className="btn" onClick={onSelectClass}>Enter Scores</button>
      </div>

      {/* Box 2 - Semester Score */}
      <div className="score-box">
        <FaBook className="score-icon" />
        <h3>Semester Score</h3>
        <p>Manage and record semester scores of students here.</p>
        <button className="btn" onClick={onSelectSemester}>Enter Scores</button>
      </div>
    </div>
  );
};

export default ScoreBoxes;
