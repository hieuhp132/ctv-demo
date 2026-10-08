const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const ctrl = require("../controllers/metrics");

router.get("/balances", auth, ctrl.balances);

module.exports = router;

























