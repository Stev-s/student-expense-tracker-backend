const Dashboard = require("../models/dashboardModel");

const getDashboardSummary = (req, res) => {

    const user_id = req.user.id;

    Dashboard.getDashboardSummary(user_id, (err, results) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        const data = results[0] || {};

        const totalIncome = Number(data.totalIncome) || 0;
        const totalExpense = Number(data.totalExpense) || 0;
        const balance = totalIncome - totalExpense;
        const totalTransactions = Number(data.totalTransactions) || 0;

        res.status(200).json({

            success: true,

            summary: {
                totalIncome,
                totalExpense,
                balance,
                totalTransactions
            }

        });

    });

};

module.exports = {
    getDashboardSummary
};