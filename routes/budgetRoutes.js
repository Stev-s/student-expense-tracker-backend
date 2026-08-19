const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
    budgetValidation
} = require("../validators/budgetValidator");

const {

    addBudget,
    getBudgets,
    getBudget,
    updateBudget,
    deleteBudget

} = require("../controllers/budgetController");

// ================= CREATE =================

router.post(
    "/",
    verifyToken,
    budgetValidation,
    validate,
    addBudget
);

// ================= GET ALL =================

router.get(
    "/",
    verifyToken,
    getBudgets
);

// ================= GET ONE =================

router.get(
    "/:id",
    verifyToken,
    getBudget
);

// ================= UPDATE =================

router.put(
    "/:id",
    verifyToken,
    budgetValidation,
    validate,
    updateBudget
);

// ================= DELETE =================

router.delete(
    "/:id",
    verifyToken,
    deleteBudget
);

module.exports = router;