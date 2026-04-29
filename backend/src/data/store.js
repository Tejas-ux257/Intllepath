const { v4: uuid } = require("uuid");

const users = [];
const progress = new Map();

function createUser(user) {
  const created = { id: uuid(), aptitude: null, recommendations: [], ...user };
  users.push(created);
  progress.set(created.id, { points: 25, badges: ["Starter"], activities: ["Registered"] });
  return created;
}

function findUserByEmail(email) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

function findUserById(id) {
  return users.find((user) => user.id === id);
}

function updateUser(id, patch) {
  const user = findUserById(id);
  if (!user) return null;
  Object.assign(user, patch);
  return user;
}

function addProgress(userId, points, activity, badge) {
  const current = progress.get(userId) || { points: 0, badges: [], activities: [] };
  current.points += points;
  current.activities.unshift(activity);
  if (badge && !current.badges.includes(badge)) current.badges.push(badge);
  progress.set(userId, current);
  return current;
}

function getProgress(userId) {
  return progress.get(userId) || { points: 0, badges: [], activities: [] };
}

module.exports = { createUser, findUserByEmail, findUserById, updateUser, addProgress, getProgress };
