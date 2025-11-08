
import React from "react";
import { FaUserCheck, FaChalkboardTeacher } from "react-icons/fa";
import Counselling from "./Counselling";
import "./CounsellingDashboard.css";

const CounsellingDashboard = ({ onSelectCounselling, onGiveCounselling }) => {
  return (
    <div className="dashboard-container">
      <div className="cards-grid">
        {/* Select Counselling Card */}
        <div className="ccard select-ccard" onClick={onSelectCounselling}>
          <div className="overlay"></div>
          <div className="ccard-content">
            <FaUserCheck className="ccard-icon" />
            <h2 className="ccard-title">Select Counselling</h2>
            <p className="ccard-text">Choose a student for counselling session.</p>
          </div>
        </div>

        {/* Give Counselling Card */}
        <div className="ccard give-ccard" onClick={onGiveCounselling}>
          <div className="overlay"></div>
          <div className="ccard-content">
            <FaChalkboardTeacher className="ccard-icon" />
            <h2 className="ccard-title">Give Counselling</h2>
            <p className="ccard-text">Conduct counselling sessions with selected students.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellingDashboard;

// import React from "react";
// import { FaUserCheck, FaChalkboardTeacher } from "react-icons/fa";
// import Counselling from "./Counselling";
// import "./CounsellingDashboard.css";

// const CounsellingDashboard = ({ onSelectCounselling, onGiveCounselling }) => {
//   return (
//     <div className="dashboard-container">
//       <div className="cards-grid">
//         {/* Select Counselling Card */}
//         <div className="card select-card" onClick={onSelectCounselling}>
//           <div className="overlay"></div>
//           <div className="card-content">
//             <FaUserCheck className="ccard-icon" />
//             <h2 className="card-title">Select Counselling</h2>
//             <p className="card-text">Choose a student for counselling session.</p>
//           </div>
//         </div>

//         {/* Give Counselling Card */}
//         <div className="card give-card" onClick={onGiveCounselling}>
//           <div className="overlay"></div>
//           <div className="card-content">
//             <FaChalkboardTeacher className="card-icon" />
//             <h2 className="card-title">Give Counselling</h2>
//             <p className="card-text">Conduct counselling sessions with selected students.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CounsellingDashboard;
