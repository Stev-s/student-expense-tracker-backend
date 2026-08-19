const Budget = require("../models/budgetModel");

// ================= ADD BUDGET =================

const addBudget = (req, res) => {

    // Logged-in user
    const user_id = req.user.id;

    const {
        month,
        year,
        budget_amount
    } = req.body;

    if (!month || !year || !budget_amount) {

        return res.status(400).json({
            success: false,
            message: "Please fill all required fields."
        });

    }

    Budget.createBudget(
        {
            user_id,
            month,
            year,
            budget_amount
        },
        (err) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.status(201).json({
                success: true,
                message: "Budget added successfully."
            });

        }
    );

};

// ================= GET ALL BUDGETS =================

const getBudgets = (req, res) => {

    const user_id = req.user.id;

    Budget.getBudgets(user_id, (err, results) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        res.status(200).json({
            success: true,
            budgets: results
        });

    });

};

// ================= GET SINGLE BUDGET =================

const getBudget = (req, res) => {

    const user_id = req.user.id;

    Budget.getBudgetById(
        req.params.id,
        user_id,
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            if (results.length === 0) {

                return res.status(404).json({
                    success: false,
                    message: "Budget not found."
                });

            }

            res.status(200).json({
                success: true,
                budget: results[0]
            });

        }
    );

};

// ================= UPDATE BUDGET =================

const updateBudget = (req, res) => {

    const user_id = req.user.id;

    const {
        month,
        year,
        budget_amount
    } = req.body;

    if (!month || !year || !budget_amount) {

        return res.status(400).json({
            success: false,
            message: "Please fill all required fields."
        });

    }

    Budget.updateBudget(
        req.params.id,
        user_id,
        {
            month,
            year,
            budget_amount
        },
        (err) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.status(200).json({
                success: true,
                message: "Budget updated successfully."
            });

        }
    );

};

// ================= DELETE BUDGET =================

const deleteBudget = (req, res) => {

    const user_id = req.user.id;

    Budget.deleteBudget(
        req.params.id,
        user_id,
        (err) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.status(200).json({
                success: true,
                message: "Budget deleted successfully."
            });

        }
    );

};

module.exports = {
    addBudget,
    getBudgets,
    getBudget,
    updateBudget,
    deleteBudget
};