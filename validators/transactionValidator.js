const { body } = require("express-validator");

// ================= TRANSACTION VALIDATION =================

const transactionValidation = [

    body("category_id")
        .notEmpty()
        .withMessage("Category is required.")
        .isInt({ min: 1 })
        .withMessage("Category ID must be a valid number."),

    body("amount")
        .notEmpty()
        .withMessage("Amount is required.")
        .isFloat({ gt: 0 })
        .withMessage("Amount must be greater than zero."),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 255 })
        .withMessage("Description cannot exceed 255 characters."),

    body("transaction_date")
        .notEmpty()
        .withMessage("Transaction date is required.")
        .isISO8601()
        .withMessage("Please provide a valid date.")

];

module.exports = {
    transactionValidation
};