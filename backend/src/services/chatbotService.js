const axios = require("axios");
const { careers } = require("../data/catalog");
const { frameQuestion } = require("../data/aptitudeQuestions");

async function askChatbot(message, profile) {
  const framedQuestion = maybeFrameAptitudeQuestion(message);
  if (framedQuestion) return framedQuestion;

  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are Intellipath, a concise career guidance assistant for students." },
            { role: "user", content: `Student profile: ${JSON.stringify(profile)}\nQuestion: ${message}` }
          ]
        },
        { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, timeout: 6000 }
      );
      return response.data.choices[0].message.content;
    } catch (_error) {
      return fallbackReply(message, profile);
    }
  }

  return fallbackReply(message, profile);
}

function maybeFrameAptitudeQuestion(message) {
  const text = message.toLowerCase();
  const asksForQuestion = text.includes("aptitude") || text.includes("question") || text.includes("test");
  if (!asksForQuestion) return null;

  const category = ["logical", "analytical", "verbal", "technical", "creative"].find((item) => text.includes(item));
  const framed = frameQuestion(category);
  return `Aptitude question (${framed.category}): ${framed.question}\nOptions:\n${framed.options.map((option, index) => `${index + 1}. ${option}`).join("\n")}\n\n${framed.guidance}`;
}

function fallbackReply(message, profile) {
  const text = message.toLowerCase();
  const career = profile?.recommendations?.[0]?.title || "your recommended career";
  const matched = careers.find((item) => text.includes(item.title.toLowerCase()) || text.includes(item.domain.toLowerCase()));
  const selected = matched || profile?.recommendations?.[0] || careers[0];
  return `Based on your profile, focus on ${career}. For ${selected.title}, start with ${selected.skills.slice(0, 3).join(", ")}, then build two small projects and collect certifications or internship proof.`;
}

module.exports = { askChatbot };
