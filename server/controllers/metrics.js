const Referral = require("../models/Referral");
const User = require("../models/User");
const Job = require("../models/Job");
const { readFile } = require("../utils/fileStore");

exports.balances = async (req, res) => {
  try {
    // Lấy credit trực tiếp từ user admin
    const admin = await User.findOne({ role: "admin" });
    const adminCredit = admin ? admin.credit : 0;

    // Lấy bonus của từng recruiter từ trường credit
    const recruiters = await User.find({ role: { $in: ["recruiter", "recruiter_freelancer"] } });
    const ctvBonusById = {};
    for (const r of recruiters) {
      ctvBonusById[String(r._id)] = r.credit || 0;
    }

    res.json({ adminCredit, ctvBonusById });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.recruiterDashboard = async (req, res) => {
  try {
    const recruiterId = String(req.user.id);
    const localUsers = readFile("users.json") || [];
    const localRecruiter = localUsers.find(
      (user) => String(user._id || user.id) === recruiterId
    );

    let referrals;
    if (localRecruiter) {
      const recruiterEmail = String(localRecruiter.email || "").toLowerCase();
      const jobsById = new Map(
        (readFile("jobs.json") || []).map((job) => [String(job._id || job.id), job])
      );
      referrals = (readFile("referrals.json") || []).filter((referral) => {
        const owner = String(referral.recruiter || "").toLowerCase();
        return owner === recruiterId.toLowerCase() || (recruiterEmail && owner === recruiterEmail);
      }).map((referral) => ({
        ...referral,
        job: jobsById.get(String(referral.job)) || referral.job,
      }));
    } else {
      const recruiter = await User.findById(recruiterId).select("_id").lean();
      if (!recruiter) return res.status(404).json({ message: "Recruiter not found" });
      referrals = await Referral.find({ recruiter: recruiter._id })
        .select("status bonus finalized job")
        .populate("job", "bonus rewardCandidateUSD")
        .lean();
    }

    const commission = (referral) => {
      const parseAmount = (value) => {
        if (value === null || value === undefined || value === "" || value === "-") return null;
        const amount = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
        return Number.isFinite(amount) ? amount : null;
      };
      const referralAmount = parseAmount(referral.bonus);
      if (referralAmount > 0) return referralAmount;
      const job = referral.job && typeof referral.job === "object" ? referral.job : {};
      const jobAmounts = [job.rewardCandidateUSD, job.bonus]
        .map(parseAmount)
        .filter((amount) => amount !== null);
      return jobAmounts.find((amount) => amount > 0) ?? referralAmount ?? jobAmounts[0] ?? 0;
    };
    const stage = (referral) => String(referral.status || "submitted").toLowerCase();
    const confirmedStages = new Set(["hired", "onboard"]);
    const inProgressStages = new Set(["submitted", "under_review", "interviewing", "offer"]);

    return res.json({
      referralCredits: referrals.length,
      toReview: referrals.filter((referral) => ["submitted", "under_review"].includes(stage(referral))).length,
      confirmedAmount: referrals
        .filter((referral) => confirmedStages.has(stage(referral)))
        .reduce((total, referral) => total + commission(referral), 0),
      inProgressAmount: referrals
        .filter((referral) => inProgressStages.has(stage(referral)))
        .reduce((total, referral) => total + commission(referral), 0),
    });
  } catch (error) {
    console.error("Failed to load recruiter dashboard metrics:", error);
    return res.status(500).json({ message: "Failed to load recruiter dashboard metrics" });
  }
};



















