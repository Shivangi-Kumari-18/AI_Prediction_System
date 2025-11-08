import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1 className="title">🎓 AI/ML Student Dropout Prediction System</h1>
        <p className="subtitle">Harnessing AI to Secure Student Futures</p>
      </div>

      <div className="about-content">
        <div className="about-card">
          <h2>📌 Project Overview</h2>
          <p>
            The <strong>Student Dropout Prediction System</strong> is an
            AI-powered solution that helps educational institutions identify
            students who are at risk of dropping out. By analyzing historical
            academic data, attendance records, and socio-economic factors, this
            system predicts the likelihood of student retention.
          </p>
        </div>

        <div className="about-card">
          <h2>🤖 How It Works</h2>
          <p>
            This system leverages <strong>Machine Learning</strong> and{" "}
            <strong>Artificial Intelligence</strong> techniques to process
            student data and generate predictions. The model is trained using
            classification algorithms (such as Logistic Regression, Random
            Forest, or Neural Networks) to ensure accurate forecasting.
          </p>
        </div>

        <div className="about-card">
          <h2>🌟 Key Features</h2>
          <ul>
            <li>📊 Data-driven insights into student performance</li>
            <li>⚡ Early warning system for at-risk students</li>
            <li>🎯 Helps institutions take preventive measures</li>
            <li>💡 Improves retention and academic outcomes</li>
          </ul>
        </div>

        <div className="about-card">
          <h2>🚀 Impact</h2>
          <p>
            By implementing this system, schools and colleges can{" "}
            <strong>proactively support students</strong>, improve success
            rates, and reduce dropout numbers. This not only benefits
            institutions but also contributes to a better future for students.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
