const router = require("express").Router();
const { chat } = require("../controllers/chatbotController");
const { requireAuth } = require("../middleware/auth");

router.post("/", requireAuth, chat);

module.exports = router;
