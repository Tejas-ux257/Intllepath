require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const aptitudeRoutes = require("./routes/aptitudeRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const progressRoutes = require("./routes/progressRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "intellipath-backend" });
});

app.get("/", (_req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Intellipath - Career Path Recommendation</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
    h1 { color: #2563eb; }
    .endpoints { background: white; padding: 20px; border-radius: 8px; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    li { margin: 10px 0; }
  </style>
</head>
<body>
  <h1>🎓 Intellipath API</h1>
  <p>Intelligent career path recommendation system</p>
  <div class="endpoints">
    <h2>Available Endpoints:</h2>
    <ul>
      <li><a href="/health">/health</a> - Health check</li>
      <li><a href="/auth">/auth</a> - Authentication</li>
      <li><a href="/aptitude">/aptitude</a> - Aptitude questions</li>
      <li><a href="/recommend">/recommend</a> - Career recommendations</li>
      <li><a href="/chatbot">/chatbot</a> - AI chatbot</li>
      <li><a href="/progress">/progress</a> - User progress</li>
    </ul>
  </div>
</body>
</html>
  `);
});

app.use("/auth", authRoutes);
app.use("/aptitude", aptitudeRoutes);
app.use("/recommend", recommendationRoutes);
app.use("/chatbot", chatbotRoutes);
app.use("/progress", progressRoutes);

async function start() {
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("MongoDB connected");
    } catch (error) {
      console.warn("MongoDB connection failed, using demo memory store:", error.message);
    }
  } else {
    console.warn("MONGO_URI not set, using demo memory store");
  }

  app.listen(port, () => {
    console.log(`Intellipath backend running on http://localhost:${port}`);
  });
}

start();
