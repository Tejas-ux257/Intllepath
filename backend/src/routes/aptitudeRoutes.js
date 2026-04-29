const router = require("express").Router();
const { getQuestions, submitAptitude } = require("../controllers/aptitudeController");
const { requireAuth } = require("../middleware/auth");

router.get("/questions", requireAuth, getQuestions);
router.post("/", requireAuth, submitAptitude);

module.exports = router;
