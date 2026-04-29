const store = require("../data/store");

async function getProgress(req, res) {
  res.json(store.getProgress(req.user.id));
}

async function addActivity(req, res) {
  const { activity = "Learning activity", points = 10, badge } = req.body;
  res.json(store.addProgress(req.user.id, Number(points), activity, badge));
}

module.exports = { getProgress, addActivity };
