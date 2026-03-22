const evaluateAnswer = require("../utils/aiEvaluator");

exports.evaluateInterview = async (req, res) => {

  try {

    const { answers } = req.body;

    let results = [];

    for (let item of answers) {

      const feedback = await evaluateAnswer(
        item.question,
        item.userAnswer
      );

      results.push({
        question: item.question,
        userAnswer: item.userAnswer,
        feedback
      });

    }

    res.json({
      message: "Interview evaluated",
      results
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Evaluation failed"
    });

  }
};