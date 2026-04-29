const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema({
  title: String,
  eligibility: String,
  streams: [String]
});

module.exports = mongoose.models.Scholarship || mongoose.model("Scholarship", scholarshipSchema);
