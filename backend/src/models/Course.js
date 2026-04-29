const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  provider: String,
  careerId: String,
  duration: String
});

module.exports = mongoose.models.Course || mongoose.model("Course", courseSchema);
