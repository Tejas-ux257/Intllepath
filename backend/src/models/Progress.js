const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: String,
    points: Number,
    badges: [String],
    activities: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.models.Progress || mongoose.model("Progress", progressSchema);
