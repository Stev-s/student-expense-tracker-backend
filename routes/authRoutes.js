const express = require("express");

const router = express.Router();


// =====================================================
// AUTH CONTROLLER
// =====================================================

const {
    registerUser,
    loginUser,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");


// =====================================================
// VALIDATORS
// =====================================================

const {
    registerValidation,
    loginValidation
} = require("../validators/authValidator");


const validate =
    require("../middleware/validationMiddleware");


// =====================================================
// AUTH MIDDLEWARE
// =====================================================

const authMiddleware =
    require("../middleware/authMiddleware");


// =====================================================
// REGISTER
// =====================================================

router.post(
    "/register",
    registerValidation,
    validate,
    registerUser
);


// =====================================================
// LOGIN
// =====================================================

router.post(
    "/login",
    loginValidation,
    validate,
    loginUser
);


// =====================================================
// FORGOT PASSWORD
// =====================================================

router.post(
    "/forgot-password",
    forgotPassword
);


// =====================================================
// RESET PASSWORD
// =====================================================

router.post(
    "/reset-password",
    resetPassword
);


// =====================================================
// UPDATE PROFILE
// =====================================================

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);


// =====================================================
// CHANGE PASSWORD
// =====================================================

router.put(
    "/change-password",
    authMiddleware,
    changePassword
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;

