const express = require("express");

const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
    getDashboardSummary
} = require("../controllers/dashboardController");

// Dashboard Summary
router.get("/", verifyToken, getDashboardSummary);

module.exports = router;