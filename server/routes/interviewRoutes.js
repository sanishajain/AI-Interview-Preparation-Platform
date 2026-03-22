// const express = require("express");
// const router = express.Router();
// const interviewController = require("../controllers/interviewController");

// router.post("/evaluate", interviewController.evaluateInterview);

// module.exports = router;

const express = require("express");
const router = express.Router();
const User = require("../models/user");

const evaluateAnswer = require("../utils/aiEvaluator");

router.post("/evaluate", async (req, res) => {

  const { question, answer } = req.body;

  try {

    // Resume text can be provided directly (useful for unauthenticated requests)
    const resumeTextFromBody = req.body.resumeText || "";
    let resumeText = resumeTextFromBody;

    // If not provided, fall back to the authenticated user's stored resume text
    if (!resumeText && req.user?.id) {
      const user = await User.findById(req.user.id);
      resumeText = user?.resumeText || "";
    }

    const aiResponse = await evaluateAnswer(question, answer, resumeText);

    // Return the evaluation object directly so the client can access score/feedback/etc.
    res.json(aiResponse);

  } catch (err) {

    console.error("Evaluation error:", err.message);

    res.status(500).json({
      result: "AI evaluation failed"
    });

  }

});

module.exports = router;