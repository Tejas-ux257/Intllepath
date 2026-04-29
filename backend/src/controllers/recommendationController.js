const User = require("../models/User");
const store = require("../data/store");
const { careers } = require("../data/catalog");
const { enrichRecommendations } = require("../services/recommendationService");
const { usingMongo } = require("./authController");

async function getRecommendations(req, res) {
  const user = usingMongo() ? await User.findById(req.user.id) : store.findUserById(req.user.id);
  const selected = user?.recommendations?.length ? user.recommendations : careers.slice(0, 3);
  res.json(enrichRecommendations(selected));
}

module.exports = { getRecommendations };
