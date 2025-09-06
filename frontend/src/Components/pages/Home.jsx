import React from "react";
import FeatureBox from "../../Components/FeatureBox";
import About from "./About";
import Contact from "./Contact";
import "./Home.css"; // 👈 normal CSS import

export default function Home() {
  return (
    <div className="home">
      <h1 className="home-title">AI-Powered Student Dropout Prediction</h1>
      <p className="home-subtitle">
        Identify at-risk students early using attendance, scores, and fee
        insights. Help mentors intervene before it’s too late.
      </p>
      <div className="home-buttons">
        <button className="btn-primary">Get Started 🚀</button>
        <button className="btn-secondary">Learn More</button>
      </div>
      <div className="home-features">
        <FeatureBox />
        <About />
        <Contact />
      </div>
    </div>
  );
}
