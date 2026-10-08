const Referral = require("../models/Referral");
const User = require("../models/User");

exports.balances = async (req, res) => {
  try {
    // Lấy credit trực tiếp từ user admin
    const admin = await User.findOne({ role: "admin" });
    const adminCredit = admin ? admin.credit : 0;

    // Lấy bonus của từng recruiter từ trường credit
    const recruiters = await User.find({ role: "recruiter" });
    const ctvBonusById = {};
    for (const r of recruiters) {
      ctvBonusById[String(r._id)] = r.credit || 0;
    }

    res.json({ adminCredit, ctvBonusById });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

























