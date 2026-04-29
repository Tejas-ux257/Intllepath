const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const store = require("../data/store");

const usingMongo = () => Boolean(process.env.MONGO_URI && User.db.readyState === 1);

function sign(user) {
  return jwt.sign({ id: user.id || user._id.toString(), email: user.email, name: user.name }, process.env.JWT_SECRET || "intellipath-dev-secret", { expiresIn: "7d" });
}

async function register(req, res) {
  const { name, email, password, education } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "Name, email, and password are required" });

  const passwordHash = await bcrypt.hash(password, 10);
  if (usingMongo()) {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });
    const user = await User.create({ name, email, passwordHash, education });
    return res.status(201).json({ token: sign(user), user: publicUser(user) });
  }

  if (store.findUserByEmail(email)) return res.status(409).json({ message: "Email already registered" });
  const user = store.createUser({ name, email, passwordHash, education });
  return res.status(201).json({ token: sign(user), user: publicUser(user) });
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password are required" });

  const user = usingMongo() ? await User.findOne({ email }) : store.findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: "Invalid email or password" });
  return res.json({ token: sign(user), user: publicUser(user) });
}

function publicUser(user) {
  return {
    id: user.id || user._id.toString(),
    name: user.name,
    email: user.email,
    education: user.education,
    aptitude: user.aptitude,
    recommendations: user.recommendations || []
  };
}

module.exports = { register, login, publicUser, usingMongo };
