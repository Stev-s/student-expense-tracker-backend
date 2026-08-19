const { body } = require("express-validator");

// ================= BUDGET VALIDATION =================

const budgetValidation = [

    body("month")
        .notEmpty()
        .withMessage("Month is required.")
        .isInt({ min: 1, max: 12 })
        .withMessage("Month must be between 1 and 12."),

    body("year")
        .notEmpty()
        .withMessage("Year is required.")
        .isInt({ min: 2000, max: 2100 })
        .withMessage("Please provide a valid year."),

    body("budget_amount")
        .notEmpty()
        .withMessage("Budget amount is required.")
        .isFloat({ gt: 0 })
        .withMessage("Budget amount must be greater than zero.")

];

module.exports = {
    budgetValidation
};