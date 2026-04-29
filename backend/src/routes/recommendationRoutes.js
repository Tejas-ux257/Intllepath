const router = require("express").Router();
const { getRecommendations } = require("../controllers/recommendationController");
const { requireAuth } = require("../middleware/auth");

router.get("/", requireAuth, getRecommendations);

module.exports = router;
