const express = require("express");

const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
    monthlyReport,
    categoryReport,
    dateRangeReport
} = require("../controllers/reportsController");

router.get("/monthly", verifyToken, monthlyReport);

router.get("/categories", verifyToken, categoryReport);

router.get("/date-range", verifyToken, dateRangeReport);

module.exports = router;