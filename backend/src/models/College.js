const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
  name: String,
  location: String,
  streams: [String]
});

module.exports = mongoose.models.College || mongoose.model("College", collegeSchema);
