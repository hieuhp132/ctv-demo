const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["admin", "recruiter", "candidate", "all"], default: "all" },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);

























