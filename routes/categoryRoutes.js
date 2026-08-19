const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getCategories
} = require("../controllers/categoryController");


// =====================================================
// GET ALL AVAILABLE CATEGORIES
// =====================================================
// Returns global categories available to every logged-in user.

router.get(
    "/",
    verifyToken,
    getCategories
);


module.exports = router;