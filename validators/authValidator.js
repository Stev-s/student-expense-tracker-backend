const { body } = require("express-validator");

// ================= REGISTER VALIDATION =================

const registerValidation = [

    body("full_name")
        .trim()
        .notEmpty()
        .withMessage("Full name is required.")
        .isLength({ min: 3 })
        .withMessage("Full name must be at least 3 characters."),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please provide a valid email address.")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters."),

    body("phone")
        .optional()
        .isLength({ min: 10 })
        .withMessage("Phone number is too short.")

];

// ================= LOGIN VALIDATION =================

const loginValidation = [

    body("email")
        .isEmail()
        .withMessage("Please enter a valid email."),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")

];

module.exports = {
    registerValidation,
    loginValidation
};