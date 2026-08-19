const { body } = require("express-validator");

// ================= CATEGORY VALIDATION =================

const categoryValidation = [

    body("category_name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required.")
        .isLength({ min: 2 })
        .withMessage("Category name must be at least 2 characters."),

    body("type")
        .notEmpty()
        .withMessage("Category type is required.")
        .isIn(["Income", "Expense"])
        .withMessage("Category type must be either Income or Expense.")

];

module.exports = {
    categoryValidation
};