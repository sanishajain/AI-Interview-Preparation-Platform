import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/dashboard.css";

export default function Dashboard() {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [qaList, setQaList] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  const sampleQuestions = [
    {
      question: "What is closure in JavaScript?",
      answer: "A closure allows a function to access variables from its outer scope even after that scope has completed."
    },
    {
      question: "Explain the event loop in JavaScript.",
      answer: "The event loop processes tasks from the queue when the call stack is empty, enabling non-blocking async behavior."
    },
    {
      question: "How do you manage state in a React application?",
      answer: "Use useState/useReducer for local state, Context/Redux for global state, and keep state minimal and predictable."
    }
  ];

  const useSampleQuestions = () => {
    setQaList(sampleQuestions);
    setAnalysis({
      skills: ["JavaScript", "React", "Async"],
      projects: 1,
      internship: "No"
    });
    localStorage.setItem("resumeText", "Sample resume text used for demonstration.");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
    setQaList([]);
    setAnalysis(null);
  };

  const handleUpload = async (e) => {

    e.preventDefault();

    if (!file) {
      setMessage("Please select a PDF resume");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    setUploading(true);

    try {

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/resume/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {

        setMessage("Resume analyzed successfully");
        setQaList(data.data || []);
        setAnalysis(data.analysis);

        if (data.resumeText) {
          localStorage.setItem("resumeText", data.resumeText);
        }

      } else {

        setMessage(data.message || "Upload failed");

      }

    } catch (error) {

      console.error(error);
      setMessage("Server error. Please try again.");

    } finally {

      setUploading(false);

    }

  };

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");

  };

  const startInterview = () => {

    navigate("/interview", {
      state: { questions: qaList }
    });

  };

  /* NEW: Go to Interview History */
  const goHistory = () => {
    navigate("/result");
  };

  return (

    <div className="dashboard">

      <header className="header">

        <h1>AI Interview Platform</h1>

        <div className="user-info">
          <span>Welcome, {user.name || "User"}</span>

          <button className="history-btn" onClick={goHistory}>
            History
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

      </header>

      <div className="content">

        <div className="upload-card">

          <h2>Upload Resume</h2>

          <form onSubmit={handleUpload}>

            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={uploading}
            />

            <button
              type="submit"
              className="upload-btn"
              disabled={uploading}
            >
              {uploading ? "Analyzing Resume..." : "Generate Questions"}
            </button>

          </form>

          {message && <p className="message">{message}</p>}

          <div className="divider">Or</div>

          <button className="sample-btn" onClick={useSampleQuestions}>
            Use sample questions (no resume needed)
          </button>

        </div>

        {analysis && (

          <div className="analysis-card">

            <h2>Resume Analysis</h2>

            <p>
              <strong>Skills:</strong>{" "}
              {analysis.skills.length > 0
                ? analysis.skills.join(", ")
                : "No skills detected"}
            </p>

            <p>
              <strong>Projects Found:</strong> {analysis.projects}
            </p>

            <p>
              <strong>Internship:</strong> {analysis.internship}
            </p>

          </div>

        )}

        {qaList.length > 0 && (

          <div className="questions-card">

            <h2>Generated Interview Questions</h2>

            {qaList.map((item, i) => (

              <div key={i} className="question">

                <div className="q-number">{i + 1}</div>

                <div className="qa-content">

                  <p className="q-text">{item.question}</p>

                  <p className="answer">
                    <strong>Suggested Answer:</strong> {item.answer}
                  </p>

                </div>

              </div>

            ))}

            <button
              className="start-btn"
              onClick={startInterview}
            >
              Start Mock Interview
            </button>

          </div>

        )}

      </div>

    </div>

  );

}