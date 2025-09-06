import React from "react";
import "./Features.css";

const Features = () => {
  const featureList = [
    {
      icon: "📊",
      title: "Data Analysis",
      desc: "Analyzes academic, attendance, and socio-economic data to generate insights.",
    },
    {
      icon: "⚡",
      title: "Early Warning",
      desc: "Identifies students at risk of dropping out before it’s too late.",
    },
    {
      icon: "🤖",
      title: "AI Predictions",
      desc: "Uses Machine Learning algorithms for accurate dropout prediction.",
    },
    {
      icon: "🎯",
      title: "Targeted Support",
      desc: "Helps institutions take proactive measures to support students.",
    },
    {
      icon: "📈",
      title: "Improved Retention",
      desc: "Boosts student retention rates and overall academic performance.",
    },
    {
      icon: "🌍",
      title: "Scalable System",
      desc: "Can be applied across schools, colleges, and universities worldwide.",
    },
  ];

  return (
    <div className="features-container">
      <h1 className="features-title">🌟 Key Features</h1>
      <div className="features-grid">
        {featureList.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h2>{feature.title}</h2>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
