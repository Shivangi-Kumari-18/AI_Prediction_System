// MentorQuizCreate.jsx
import React, { useState } from "react";
import axios from "axios";

const MentorQuizCreate = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  const handleSubmit = async () => {
    await axios.post("http://localhost:5000/api/quiz/create", {
      title,
      mentorId: "mentor123",
      questions,
    });
    alert("Quiz Created!");
  };

  return (
    <div>
      <h2>Create Quiz</h2>
      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {questions.map((q, i) => (
        <div key={i}>
          <input
            type="text"
            placeholder="Question"
            value={q.question}
            onChange={(e) => {
              const newQ = [...questions];
              newQ[i].question = e.target.value;
              setQuestions(newQ);
            }}
          />
          {q.options.map((opt, j) => (
            <input
              key={j}
              type="text"
              placeholder={`Option ${j + 1}`}
              value={opt}
              onChange={(e) => {
                const newQ = [...questions];
                newQ[i].options[j] = e.target.value;
                setQuestions(newQ);
              }}
            />
          ))}
          <select
            value={q.correctAnswer}
            onChange={(e) => {
              const newQ = [...questions];
              newQ[i].correctAnswer = Number(e.target.value);
              setQuestions(newQ);
            }}
          >
            <option value={0}>Option 1</option>
            <option value={1}>Option 2</option>
            <option value={2}>Option 3</option>
            <option value={3}>Option 4</option>
          </select>
        </div>
      ))}
      <button onClick={addQuestion}>Add Question</button>
      <button onClick={handleSubmit}>Save Quiz</button>
    </div>
  );
};

export default MentorQuizCreate;
