const User = require("../models/User");
const store = require("../data/store");
const { predictCareers, enrichRecommendations } = require("../services/recommendationService");
const { usingMongo } = require("./authController");
const { publicQuestions, scoreAnswers } = require("../data/aptitudeQuestions");

function getQuestions(_req, res) {
  res.json({ questions: publicQuestions() });
}

async function submitAptitude(req, res) {
  const scores = req.body.answers ? scoreAnswers(req.body.answers) : normalizeScores(req.body.scores || req.body);
  const careers = await predictCareers(scores);
  const recommendations = enrichRecommendations(careers);

  if (usingMongo()) {
    await User.findByIdAndUpdate(req.user.id, { aptitude: scores, recommendations: recommendations.careers });
  } else {
    store.updateUser(req.user.id, { aptitude: scores, recommendations: recommendations.careers });
    store.addProgress(req.user.id, 75, "Completed aptitude test", "Career Explorer");
  }

  res.json({ scores, recommendations });
}

function normalizeScores(input) {
  return {
    logical: clamp(input.logical),
    analytical: clamp(input.analytical),
    verbal: clamp(input.verbal),
    technical: clamp(input.technical),
    creative: clamp(input.creative)
  };
}

function clamp(value) {
  return Math.max(0, Math.min(10, Number(value || 0)));
}

module.exports = { getQuestions, submitAptitude };
