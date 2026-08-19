const Reports = require("../models/reportsModel");

// ================= MONTHLY REPORT =================

const monthlyReport = (req, res) => {

    const user_id = req.user.id;

    Reports.getMonthlyReport(user_id, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            report: results
        });

    });

};

// ================= CATEGORY REPORT =================

const categoryReport = (req, res) => {

    const user_id = req.user.id;

    Reports.getCategoryReport(user_id, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.status(200).json({
            success: true,
            report: results
        });

    });

};

// ================= DATE RANGE REPORT =================

const dateRangeReport = (req, res) => {

    const user_id = req.user.id;

    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {

        return res.status(400).json({
            success: false,
            message: "Please provide startDate and endDate."
        });

    }

    Reports.getDateRangeReport(
        user_id,
        startDate,
        endDate,
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.status(200).json({
                success: true,
                report: results
            });

        }
    );

};

module.exports = {
    monthlyReport,
    categoryReport,
    dateRangeReport
};