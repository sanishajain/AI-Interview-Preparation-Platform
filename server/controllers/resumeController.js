const fs = require("fs");
const pdfParse = require("pdf-parse");
const User = require("../models/user");
const evaluateAnswer = require("../utils/aiEvaluator");

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

exports.uploadResume = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);

    let resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: "Could not extract text from PDF" });
    }

    // Save resumeText to user for later personalization
    await User.findByIdAndUpdate(req.user.id, { resumeText });

    resumeText = resumeText.toLowerCase();

    const techKeywords = [
      "javascript",
      "react",
      "node",
      "express",
      "mongodb",
      "java",
      "python",
      "html",
      "css",
      "mysql",
      "firebase"
    ];

    const detectedSkills = techKeywords.filter(skill =>
      resumeText.includes(skill)
    );

    const projectCount = (resumeText.match(/project/g) || []).length;
    const internship = resumeText.includes("intern") ? "Yes" : "No";

    // Base questions that should always appear
    const baseQuestions = [
      "Tell me about yourself.",
      "Explain one project mentioned in your resume.",
      "What challenges did you face during development?",
      "Why should we hire you?",
      "How do you stay current with new technologies?",
      "Describe your typical workflow when starting a new feature.",
      "How do you handle tight deadlines and shifting priorities?",
      "What tools do you use for debugging and testing?"
    ];

    // Skill-specific questions
    const questionBank = {
      javascript: [
        "What is closure in JavaScript?",
        "Explain the event loop in JavaScript.",
        "What are the differences between let, const, and var?"
      ],
      react: [
        "What are React hooks?",
        "Explain the virtual DOM in React.",
        "How do you manage state in a React application?"
      ],
      node: [
        "What is Node.js?",
        "Explain asynchronous programming in Node.js.",
        "How do you handle errors in a Node.js application?"
      ],
      mongodb: [
        "What is MongoDB and why is it used?",
        "How do you design a schema in MongoDB?"
      ],
      express: [
        "What is Express.js used for?",
        "How do you structure routes and middleware in Express?"
      ]
    };

    const extraQuestions = [
      "How do you approach learning a new framework or language?",
      "What is your preferred method for collaborating with designers and product managers?",
      "Describe a time you had to refactor code. What was your approach?",
      "How do you ensure accessibility in web applications?",
      "What is your experience with testing (unit/integration/end-to-end)?",
      "Tell us about a time you received feedback and how you used it to improve."
    ];

    // Assemble the pool of questions
    let questions = [...baseQuestions];
    detectedSkills.forEach(skill => {
      if (questionBank[skill]) {
        questions.push(...questionBank[skill]);
      }
    });

    questions.push(...extraQuestions);

    // Select a random set (between 8 and 14 questions) so it changes each upload
    const desiredCount = Math.min(14, Math.max(8, Math.floor(Math.random() * 7) + 8));
    const selectedQuestions = shuffle(questions).slice(0, desiredCount);

    // Generate a “perfect answer” for each question (based on resume context)
    const data = [];
    for (const q of selectedQuestions) {
      const evaluation = await evaluateAnswer(q, "", resumeText);
      data.push({
        question: q,
        answer: evaluation.feedback || evaluation.correctAnswer || ""
      });
    }

    fs.unlinkSync(req.file.path);

    return res.json({
      message: "Resume processed successfully",
      resumeText,
      analysis: {
        skills: detectedSkills,
        projects: projectCount,
        internship
      },
      data
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Error processing resume"
    });

  }
};