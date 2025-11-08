import React from "react";
import { useNavigate } from "react-router-dom";
import About from "../Abouts/About";
import Contact from "../Contacts/Contact";
import "./Home.css";
import Features from "../Feature/Features";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1 className="home-title">AI-Powered Student Dropout Prediction</h1>
      <p className="home-subtitle">
        Identify at-risk students early using attendance, scores, and fee
        insights. Help mentors intervene before it’s too late.
      </p>
      <div className="home-buttons">
        <button
          className="btn-primary"
          onClick={() => navigate("/loginoptions")}
        >
          Get Started 🚀
        </button>

        <button className="btn-secondary">Learn More</button>
      </div>
      <div className="home-features">
        <Features />
        <About />
        <Contact />
      </div>
    </div>
  );
}
