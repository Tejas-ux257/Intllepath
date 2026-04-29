const router = require("express").Router();
const { getProgress, addActivity } = require("../controllers/progressController");
const { requireAuth } = require("../middleware/auth");

router.get("/", requireAuth, getProgress);
router.post("/", requireAuth, addActivity);

module.exports = router;
