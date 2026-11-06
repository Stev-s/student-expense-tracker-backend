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

// ================= GET CURRENT MONTH BUDGET ALERT =================

const getCurrentBudgetAlert = (req, res) => {
    const user_id = req.user.id;

    const now = new Date();
    const monthNumber = now.getMonth() + 1;
    const monthName = now.toLocaleString("en-US", {
        month: "long"
    });
    const year = now.getFullYear();

    Budget.getCurrentBudgetStatus(
        user_id,
        monthName,
        monthNumber,
        year,
        (err, results) => {
            if (err) {
                console.error("Budget alert calculation error:", err);

                return res.status(500).json({
                    success: false,
                    message: "Unable to calculate budget status."
                });
            }

            if (!results || results.length === 0) {
                return res.status(200).json({
                    success: true,
                    has_budget: false,
                    message: "No budget has been set for the current month."
                });
            }

            const budget = results[0];
            const budgetAmount = Number(budget.budget_amount);
            const totalExpenses = Number(budget.total_expenses);
            const percentage = budgetAmount > 0
                ? (totalExpenses / budgetAmount) * 100
                : 0;

            let alert = null;

            if (percentage >= 100) {
                alert = {
                    level: "exceeded",
                    title: "Budget reached or exceeded",
                    message: `You have spent ${percentage.toFixed(1)}% of your monthly budget.`
                };
            } else if (percentage >= 80) {
                alert = {
                    level: "warning",
                    title: "Budget warning",
                    message: `You have used ${percentage.toFixed(1)}% of your monthly budget.`
                };
            }

            return res.status(200).json({
                success: true,
                has_budget: true,
                budget: {
                    id: budget.budget_id,
                    month: budget.month,
                    year: budget.year,
                    budget_amount: budgetAmount,
                    total_expenses: totalExpenses,
                    remaining: budgetAmount - totalExpenses,
                    percentage_used: Number(percentage.toFixed(2))
                },
                alert
            });
        }
    );
};

module.exports = {
    addBudget,
    getBudgets,
    getBudget,
    updateBudget,
    deleteBudget,
    getCurrentBudgetAlert
};
