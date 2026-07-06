const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  rawText: {
    type: String,
    required: true,
  },
  extractedTaskIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Meeting", meetingSchema);
