import { useState, useEffect } from "react";
import "../css/history.css";

export default function InterviewHistory() {

  const [history, setHistory] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {

    const saved = JSON.parse(localStorage.getItem("interviewHistory")) || [];

    /* remove duplicate interviews using date */
    const uniqueHistory = saved.filter(
      (item, index, self) =>
        index === self.findIndex((t) => t.date === item.date)
    );

    /* newest interview first */
    setHistory([...uniqueHistory].reverse());

  }, []);

  return (

    <div className="history-page">

      <h2>Your Interview History</h2>

      {/* HISTORY LIST */}

      {!selectedInterview ? (

        <div className="history-list">

          {history.length === 0 ? (

            <p className="no-history">No interviews taken yet.</p>

          ) : (

            history.map((item, index) => (

              <div key={index} className="history-card">

                <div>
                  <h3>Interview #{history.length - index}</h3>

                  <p>
                    <strong>Date:</strong> {item.date}
                  </p>

                  <p>
                    <strong>Score:</strong> {item.score}/100
                  </p>
                </div>

                <button
                  className="view-btn"
                  onClick={() => setSelectedInterview(item)}
                >
                  View Interview
                </button>

              </div>

            ))

          )}

        </div>

      ) : (

        /* INTERVIEW DETAILS PAGE */

        <div className="interview-details">

          <button
            className="back-btn"
            onClick={() => setSelectedInterview(null)}
          >
            ← Back
          </button>

          <h3>Interview Details</h3>

          {selectedInterview.questions.map((q, i) => (

            <div key={i} className="qa-box">

              <p>
                <strong>Question:</strong> {q.question}
              </p>

              <p>
                <strong>Your Answer:</strong> {q.userAnswer || "No answer"}
              </p>

              <p>
                <strong>Score:</strong> {q.ai?.score || 0}/100
              </p>

              {q.ai?.feedback && (
                <p>
                  <strong>Feedback:</strong> {q.ai.feedback}
                </p>
              )}

              {q.ai?.correctAnswer && (
                <p>
                  <strong>Perfect Answer:</strong> {q.ai.correctAnswer}
                </p>
              )}

            </div>

          ))}

        </div>

      )}

    </div>

  );

}