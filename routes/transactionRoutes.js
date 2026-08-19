const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");

const {
    transactionValidation
} = require("../validators/transactionValidator");

const {
    addTransaction,
    getTransactions,
    getTransaction,
    updateTransaction,
    deleteTransaction,
    searchTransactions
} = require("../controllers/transactionController");

// ================= CREATE =================

router.post(
    "/",
    verifyToken,
    transactionValidation,
    validate,
    addTransaction
);

// ================= SEARCH =================

router.get(
    "/search",
    verifyToken,
    searchTransactions
);

// ================= GET ALL =================

router.get(
    "/",
    verifyToken,
    getTransactions
);

// ================= GET ONE =================

router.get(
    "/:id",
    verifyToken,
    getTransaction
);

// ================= UPDATE =================

router.put(
    "/:id",
    verifyToken,
    transactionValidation,
    validate,
    updateTransaction
);

// ================= DELETE =================

router.delete(
    "/:id",
    verifyToken,
    deleteTransaction
);

module.exports = router;