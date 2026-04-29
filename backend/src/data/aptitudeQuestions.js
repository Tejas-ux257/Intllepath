const aptitudeQuestions = [
  {
    id: "logical-1",
    category: "logical",
    question: "If all Bloops are Razzies and all Razzies are Lazzies, which statement is true?",
    options: [
      { id: "a", text: "All Bloops are Lazzies", score: 2 },
      { id: "b", text: "All Lazzies are Bloops", score: 0 },
      { id: "c", text: "No Bloops are Lazzies", score: 0 },
      { id: "d", text: "The relation cannot be known", score: 1 }
    ]
  },
  {
    id: "logical-2",
    category: "logical",
    question: "Find the next number in the series: 3, 6, 12, 24, ?",
    options: [
      { id: "a", text: "30", score: 0 },
      { id: "b", text: "36", score: 0 },
      { id: "c", text: "48", score: 2 },
      { id: "d", text: "54", score: 0 }
    ]
  },
  {
    id: "analytical-1",
    category: "analytical",
    question: "A college survey shows many students struggle with career choices. What should you inspect first?",
    options: [
      { id: "a", text: "Student interests, marks, and skill gaps", score: 2 },
      { id: "b", text: "Only the most popular career trend", score: 0 },
      { id: "c", text: "Only parents' preferred choices", score: 0 },
      { id: "d", text: "Ignore data and choose randomly", score: 0 }
    ]
  },
  {
    id: "analytical-2",
    category: "analytical",
    question: "Which metric best proves that a recommendation system is useful?",
    options: [
      { id: "a", text: "Number of colors in the UI", score: 0 },
      { id: "b", text: "Recommendation relevance and user satisfaction", score: 2 },
      { id: "c", text: "Length of the project title", score: 0 },
      { id: "d", text: "Only server startup time", score: 1 }
    ]
  },
  {
    id: "verbal-1",
    category: "verbal",
    question: "Choose the best meaning of 'informed decision'.",
    options: [
      { id: "a", text: "A decision based on useful knowledge", score: 2 },
      { id: "b", text: "A decision made without thinking", score: 0 },
      { id: "c", text: "A decision copied from friends", score: 0 },
      { id: "d", text: "A decision made only for speed", score: 0 }
    ]
  },
  {
    id: "verbal-2",
    category: "verbal",
    question: "Which sentence is the clearest chatbot response?",
    options: [
      { id: "a", text: "Career maybe thing future go now.", score: 0 },
      { id: "b", text: "Start with Python basics, then build two data projects.", score: 2 },
      { id: "c", text: "Many careers exist, okay.", score: 1 },
      { id: "d", text: "Unrelated data makes a career.", score: 0 }
    ]
  },
  {
    id: "technical-1",
    category: "technical",
    question: "Which technology is used in this project to create REST APIs?",
    options: [
      { id: "a", text: "Node.js and Express", score: 2 },
      { id: "b", text: "Photoshop", score: 0 },
      { id: "c", text: "Spreadsheet formulas only", score: 0 },
      { id: "d", text: "Video editing software", score: 0 }
    ]
  },
  {
    id: "technical-2",
    category: "technical",
    question: "What does the ML service predict from aptitude scores?",
    options: [
      { id: "a", text: "Suitable career domains", score: 2 },
      { id: "b", text: "Weather forecast", score: 0 },
      { id: "c", text: "Random passwords", score: 0 },
      { id: "d", text: "Only college building size", score: 0 }
    ]
  },
  {
    id: "creative-1",
    category: "creative",
    question: "A student finds the dashboard boring. What is the best improvement?",
    options: [
      { id: "a", text: "Add clear progress, badges, and useful next steps", score: 2 },
      { id: "b", text: "Remove all content", score: 0 },
      { id: "c", text: "Use only random animations", score: 1 },
      { id: "d", text: "Hide recommendations", score: 0 }
    ]
  },
  {
    id: "creative-2",
    category: "creative",
    question: "Which activity best shows creativity for a UI/UX career?",
    options: [
      { id: "a", text: "Designing and testing a student dashboard prototype", score: 2 },
      { id: "b", text: "Memorizing file names only", score: 0 },
      { id: "c", text: "Avoiding user feedback", score: 0 },
      { id: "d", text: "Deleting the portfolio", score: 0 }
    ]
  }
];

function publicQuestions() {
  return aptitudeQuestions.map(({ id, category, question, options }) => ({
    id,
    category,
    question,
    options: options.map(({ id: optionId, text }) => ({ id: optionId, text }))
  }));
}

function scoreAnswers(answers = {}) {
  const totals = { logical: 0, analytical: 0, verbal: 0, technical: 0, creative: 0 };
  const maximums = { logical: 0, analytical: 0, verbal: 0, technical: 0, creative: 0 };

  aptitudeQuestions.forEach((question) => {
    const maxScore = Math.max(...question.options.map((option) => option.score));
    maximums[question.category] += maxScore;
    const selected = question.options.find((option) => option.id === answers[question.id]);
    totals[question.category] += selected ? selected.score : 0;
  });

  return Object.fromEntries(
    Object.entries(totals).map(([category, score]) => [
      category,
      maximums[category] ? Math.round((score / maximums[category]) * 10) : 0
    ])
  );
}

function frameQuestion(category) {
  const normalized = category?.toLowerCase();
  const question = aptitudeQuestions.find((item) => item.category === normalized) || aptitudeQuestions[0];
  return {
    category: question.category,
    question: question.question,
    options: question.options.map((option) => option.text),
    guidance: `This ${question.category} question helps measure aptitude for career recommendation. Choose the option that best fits the problem, then Intellipath converts it into a skill score.`
  };
}

module.exports = { aptitudeQuestions, publicQuestions, scoreAnswers, frameQuestion };
