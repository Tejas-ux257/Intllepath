const User = require("../models/User");
const store = require("../data/store");
const { askChatbot } = require("../services/chatbotService");
const { usingMongo } = require("./authController");

async function chat(req, res) {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message is required" });
  const user = usingMongo() ? await User.findById(req.user.id) : store.findUserById(req.user.id);
  const reply = await askChatbot(message, user);
  if (!usingMongo()) store.addProgress(req.user.id, 10, "Asked chatbot question", "Curious Learner");
  res.json({ reply });
}

module.exports = { chat };
