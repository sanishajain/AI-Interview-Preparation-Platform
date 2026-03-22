function extractSentences(text) {
  return text
    .replace(/\n/g, " ")
    .split(/[.?!]/)
    .map(s => s.trim())
    .filter(Boolean);
}

function shouldSkipSentence(sentence) {
  const lower = sentence.toLowerCase();

  // Skip obvious contact info
  const contactPatterns = [
    /@/, // emails
    /\b\d{10,}\b/, // long number sequences
    /http(s)?:\/\//, // urls
    /linkedin\.com/, // linkedin
    /github\.com/ // github
  ];

  return contactPatterns.some((pattern) => pattern.test(lower));
}

function findResumeSentence(question, resumeText) {
  if (!resumeText) return null;
  const sentences = extractSentences(resumeText);
  const lowerSentences = sentences.map(s => s.toLowerCase());
  const q = question.toLowerCase();

  const keywordMap = [
    { keys: ["closure"], terms: ["closure"] },
    { keys: ["event loop"], terms: ["event loop"] },
    { keys: ["react hooks"], terms: ["hook", "useeffect", "usestate", "usememo"] },
    { keys: ["virtual dom"], terms: ["virtual dom"] },
    { keys: ["node.js", "node"], terms: ["node.js", "node"] },
    { keys: ["asynchronous"], terms: ["async", "callbacks", "promise", "await"] },
    { keys: ["mongodb"], terms: ["mongodb"] },
    { keys: ["express"], terms: ["express"] },
    { keys: ["project"], terms: ["project", "developed", "built"] },
    { keys: ["challenges"], terms: ["challenge", "problem", "issue"] },
    { keys: ["hire"], terms: ["hire", "fit", "value"] },
    { keys: ["yourself"], terms: ["experience", "background", "skills"] }
  ];

  const match = keywordMap.find(entry =>
    entry.keys.some(k => q.includes(k))
  );

  const terms = match ? match.terms : [];

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const lowerSentence = lowerSentences[i];

    if (shouldSkipSentence(sentence)) continue;

    if (terms.some(term => lowerSentence.includes(term))) {
      return sentence;
    }
  }

  // If no match by keyword, return first non-contact sentence as a fallback.
  const fallback = sentences.find(s => !shouldSkipSentence(s));
  return fallback || null;
}

function makePerfectAnswerForQuestion(question) {
  const q = question.toLowerCase();

  if (q.includes("tell me about yourself")) {
    return (
      "Start with a brief overview of your background, highlight key strengths (e.g., frontend/back-end skills), and mention a recent project or accomplishment that demonstrates your fit for the role."
    );
  }

  if (q.includes("explain one project") || q.includes("project")) {
    return (
      "Describe a project you worked on: explain the goal, your role, the technologies used, and the impact or results (such as performance improvements or user growth)."
    );
  }

  if (q.includes("challenges") || q.includes("refactor")) {
    return (
      "Discuss a technical challenge or refactor you handled: describe the problem, the approach you took to resolve it, and the positive outcome or lessons learned. Mention how you validated the changes (tests, reviews)."
    );
  }

  if (q.includes("why should we hire")) {
    return (
      "Share why you’re motivated for the role, how your skills match the job, and how you can contribute to the team. Mention your strengths, adaptability, and willingness to learn."
    );
  }

  if (q.includes("how do you stay current") || q.includes("new technologies")) {
    return (
      "Explain how you keep your skills sharp: follow tech blogs, take courses, read docs, build side projects, attend meetups, and learn from peers. Give an example of something you recently learned."
    );
  }

  if (q.includes("typical workflow")) {
    return (
      "Outline your workflow: clarify requirements, break down tasks, write code with tests, run code reviews, then deploy and monitor. Mention collaboration with teammates during each stage."
    );
  }

  if (q.includes("tight deadlines") || q.includes("shifting priorities")) {
    return (
      "Talk about how you prioritize work, communicate trade-offs, and stay focused under pressure. Mention practical techniques like breaking tasks into small increments and checking in with stakeholders."
    );
  }

  if (q.includes("debugging") || q.includes("testing")) {
    return (
      "Mention the tools and practices you use: logging, debuggers, unit/integration tests, and automated test suites. Explain how you write tests early and use them to prevent regressions."
    );
  }

  if (q.includes("experience with testing")) {
    return (
      "Share your testing experience: unit tests for components/modules, integration tests for service interactions, and end-to-end tests for user flows. Mention frameworks you use (e.g., Jest, Cypress) and how testing improves reliability."
    );
  }

  if (q.includes("received feedback")) {
    return (
      "Talk about a time you got constructive feedback, how you interpreted it, and what changes you made. Highlight that you view feedback as a growth opportunity and iterate quickly."
    );
  }

  if (q.includes("collaborating") || q.includes("designers") || q.includes("product managers")) {
    return (
      "Describe how you communicate requirements, share prototypes, and iterate based on feedback. Emphasize active listening, clear specs, and aligning on success criteria."
    );
  }

  if (q.includes("accessibility")) {
    return (
      "Explain your approach to accessibility: use semantic HTML, keyboard navigation, ARIA attributes, and test with screen readers and contrast tools. Describe how you make interfaces usable for everyone."
    );
  }

  if (q.includes("closure")) {
    return (
      "A closure is when a function retains access to variables from its enclosing scope, even after that scope has finished executing. It’s useful for data privacy and creating factory functions."
    );
  }

  if (q.includes("event loop")) {
    return (
      "The event loop is what allows JavaScript to be non-blocking: it processes callbacks from the task queue once the call stack is empty, enabling async operations like timers and I/O."
    );
  }

  if (q.includes("react hooks")) {
    return (
      "React Hooks let you use state and lifecycle features in functional components. Common hooks include useState, useEffect, and custom hooks for reusable logic."
    );
  }

  if (q.includes("virtual dom")) {
    return (
      "The virtual DOM is an in-memory snapshot of the UI. React uses it to efficiently update the real DOM by diffing changes and applying only the minimal updates."
    );
  }

  if (q.includes("manage state")) {
    return (
      "Describe your state strategy: local state with useState/useReducer, derived state with useMemo, and global state with Context or libraries (Redux/MobX/Recoil). Mention how you keep state predictable and avoid prop drilling."
    );
  }

  if (q.includes("handle errors") && q.includes("node")) {
    return (
      "Talk about error-handling practices in Node: use try/catch with async/await, handle promise rejections, log errors with context, and return appropriate HTTP status codes. Mention using middleware like express-error-handler or monitoring tools."
    );
  }

  if (q.includes("node.js")) {
    return (
      "Node.js is a JavaScript runtime built on Chrome’s V8 engine, used for building server-side applications with non-blocking I/O and event-driven architecture."
    );
  }

  if (q.includes("asynchronous")) {
    return (
      "Asynchronous programming uses callbacks, promises, or async/await to handle operations that take time (like network requests) without blocking the event loop."
    );
  }

  if (q.includes("let") && q.includes("const") && q.includes("var")) {
    return (
      "Explain that let and const are block-scoped; const is for variables that should not be reassigned, while var is function-scoped and can lead to hoisting-related bugs."
    );
  }

  if (q.includes("mongodb")) {
    return (
      "MongoDB is a document database that stores JSON-like documents. It’s useful for flexible schemas, horizontal scaling, and rapid development with JavaScript/Node.js stacks."
    );
  }

  if (q.includes("design a schema") || q.includes("schema in mongodb")) {
    return (
      "Explain how you model data in MongoDB: embed related documents when you need fast reads, use references when data is normalized, and define indexes for query performance. Mention validating data and planning for growth."
    );
  }

  if (q.includes("express")) {
    return (
      "Express.js is a minimal web framework for Node.js used to build APIs and web servers. It provides routing, middleware support, and easy request/response handling."
    );
  }

  // Default generic answer
  return (
    "Provide a clear, structured response: define key terms, explain how you’ve applied them in real projects, and highlight the impact of your work."
  );
}

function makeFullAnswerForQuestion(question, resumeText) {
  const resumeSentence = findResumeSentence(question, resumeText);

  if (resumeSentence) {
    return `Based on your resume, you could answer like this: ${resumeSentence.trim()}.`;
  }

  return makePerfectAnswerForQuestion(question);
}

function getKeywordsForQuestion(question) {
  const q = question.toLowerCase();

  const mapping = [
    {
      match: /closure/,
      keywords: ["closure", "scope", "function", "enclosing", "private", "remember", "retain", "access"]
    },
    {
      match: /event loop/,
      keywords: ["event loop", "call stack", "task queue", "callback", "async"]
    },
    {
      match: /react hooks/,
      keywords: ["useState", "useEffect", "hooks", "state", "lifecycle"]
    },
    {
      match: /virtual dom/,
      keywords: ["virtual dom", "diffing", "reconciliation", "dom", "render"]
    },
    {
      match: /manage state/,
      keywords: ["state", "useState", "useReducer", "context", "global"]
    },
    {
      match: /node\.js/,
      keywords: ["node", "runtime", "v8", "server", "non-blocking"]
    },
    {
      match: /handle errors/,
      keywords: ["try", "catch", "rejection", "logging", "status"]
    },
    {
      match: /let, const, and var/,
      keywords: ["let", "const", "var", "scope", "hoisting"]
    },
    {
      match: /schema in mongodb/,
      keywords: ["schema", "document", "index", "embed", "reference"]
    },
    {
      match: /testing/,
      keywords: ["unit", "integration", "end-to-end", "jest", "cypress"]
    },
    {
      match: /feedback/,
      keywords: ["feedback", "improve", "learn", "iterate", "growth"]
    }
  ];

  const entry = mapping.find((item) => item.match.test(q));
  return entry ? entry.keywords : [];
}

function calculateScore(answer, keywords) {
  const normalized = (answer || "").toLowerCase();
  if (!normalized.trim()) return 0;

  if (!keywords.length) {
    // Simple guess: length and presence of a few terms
    const wordCount = normalized.split(/\s+/).filter(Boolean).length;
    if (wordCount < 20) return 40;
    if (wordCount < 50) return 60;
    return 75;
  }

  const matched = keywords.filter((k) => normalized.includes(k.toLowerCase()));
  const ratio = Math.min(1, matched.length / keywords.length);
  const base = Math.round(ratio * 90) + 10;
  return Math.min(100, base);
}

async function evaluateAnswer(question, answer, resumeText) {
  const fullAnswer = makeFullAnswerForQuestion(question, resumeText);
  const perfectAnswer = makePerfectAnswerForQuestion(question);
  const keywords = getKeywordsForQuestion(question);

  const score = calculateScore(answer, keywords);

  const strengthNotes = [];
  const weaknessNotes = [];

  if (!answer || !answer.trim()) {
    strengthNotes.push("You didn't provide an answer yet.");
    weaknessNotes.push("Try answering the question to get a score and feedback.");
  } else {
    if (score >= 80) {
      strengthNotes.push("Your answer covers the main points well.");
    } else {
      weaknessNotes.push("Your answer is missing some key points.");
    }

    if (keywords.length) {
      const normalized = answer.toLowerCase();
      const missing = keywords.filter((k) => !normalized.includes(k.toLowerCase()));
      if (missing.length) {
        weaknessNotes.push(`Consider mentioning: ${missing.slice(0, 3).join(", ")}.`);
      }
    }
  }

  return {
    score,
    strengths: strengthNotes.join(" "),
    weaknesses: weaknessNotes.join(" "),
    feedback: fullAnswer,
    correctAnswer: perfectAnswer
  };
}


module.exports = evaluateAnswer;