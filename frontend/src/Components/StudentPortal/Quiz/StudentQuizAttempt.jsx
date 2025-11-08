// StudentQuizAttempt.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentQuizAttempt = () => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/quiz").then((res) => {
      setQuiz(res.data[0]); // load first quiz for demo
    });
  }, []);

  const handleSelect = (qIndex, optionIndex) => {
    const newAns = [...answers];
    newAns[qIndex] = optionIndex;
    setAnswers(newAns);
  };

  const submitQuiz = async () => {
    const res = await axios.post(`http://localhost:5000/api/quiz/submit/${quiz._id}`, {
      studentId: "student123",
      answers,
    });
    alert(`Your score: ${res.data.score}`);
  };

  if (!quiz) return <p>Loading quiz...</p>;

  return (
    <div>
      <h2>{quiz.title}</h2>
      {quiz.questions.map((q, i) => (
        <div key={i}>
          <p>{q.question}</p>
          {q.options.map((opt, j) => (
            <label key={j}>
              <input
                type="radio"
                name={`q${i}`}
                value={j}
                onChange={() => handleSelect(i, j)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={submitQuiz}>Submit</button>
    </div>
  );
};

export default StudentQuizAttempt;
