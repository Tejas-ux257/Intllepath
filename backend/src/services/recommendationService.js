const axios = require("axios");
const { careers, courses, colleges, scholarships } = require("../data/catalog");

const weights = {
  "software-engineer": { logical: 2, analytical: 2, verbal: 0.5, technical: 3, creative: 1 },
  "data-scientist": { logical: 2, analytical: 3, verbal: 0.5, technical: 2, creative: 0.5 },
  "cybersecurity-analyst": { logical: 2, analytical: 2, verbal: 0.5, technical: 3, creative: 0.5 },
  "ui-ux-designer": { logical: 0.5, analytical: 1, verbal: 1, technical: 1, creative: 3 },
  "business-analyst": { logical: 1, analytical: 2, verbal: 3, technical: 1, creative: 1 }
};

function localPredict(scores) {
  return careers
    .map((career) => ({
      ...career,
      score: Object.entries(scores).reduce((sum, [key, value]) => sum + Number(value || 0) * (weights[career.id][key] || 0), 0)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

async function predictCareers(scores) {
  const baseUrl = process.env.ML_SERVICE_URL || "http://localhost:7000";
  try {
    const response = await axios.post(`${baseUrl}/predict`, { scores }, { timeout: 1500 });
    const ids = response.data.recommendations.map((item) => item.id);
    const mlRanked = ids.map((id) => careers.find((career) => career.id === id)).filter(Boolean);
    return mlRanked.length ? mlRanked : localPredict(scores);
  } catch (_error) {
    return localPredict(scores);
  }
}

function enrichRecommendations(selectedCareers) {
  const primary = selectedCareers[0];
  return {
    careers: selectedCareers,
    courses: courses.filter((course) => selectedCareers.some((career) => career.id === course.careerId)),
    colleges: colleges.filter((college) => selectedCareers.some((career) => college.streams.includes(career.domain))),
    scholarships: scholarships.filter((scholarship) => selectedCareers.some((career) => scholarship.streams.includes(career.domain))),
    nextSteps: primary ? primary.roadmap : []
  };
}

module.exports = { predictCareers, enrichRecommendations };
