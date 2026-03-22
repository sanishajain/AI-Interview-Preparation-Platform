import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/interview.css";

export default function InterviewPage() {

  const location = useLocation();
  const navigate = useNavigate();

  const questions = location.state?.questions || [];

  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    if (questions.length === 0) {
      navigate("/dashboard");
    }
  }, []);

  const nextQuestion = () => {

    if (answer.trim() === "") {
      alert("Please enter your answer before continuing.");
      return;
    }

    const updated = [...answers, answer];
    setAnswers(updated);
    setAnswer("");

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      navigate("/result", {
        state: {
          questions,
          answers: updated
        }
      });
    }
  };

  if (questions.length === 0) return null;

  return (
    <div className="interview-container">

      <div className="interview-card">

        <h2>Mock Interview</h2>

        <p className="q-count">
          Question {current + 1} of {questions.length}
        </p>

        <h3>{questions[current].question}</h3>

        <textarea
          placeholder="Type your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />

        <button onClick={nextQuestion}>
          {current + 1 === questions.length
            ? "Finish Interview"
            : "Next Question"}
        </button>

      </div>

    </div>
  );
}