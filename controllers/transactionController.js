const Transaction = require("../models/transactionModel");
const db = require("../config/db");

// =====================================================
// CREATE TRANSACTION
// =====================================================

const addTransaction = (req, res) => {

    const user_id = req.user.id;

    const {
        category_id,
        custom_category,
        amount,
        description,
        transaction_date
    } = req.body;


    // =================================================
    // BASIC VALIDATION
    // =================================================

    if (!amount || !transaction_date) {

        return res.status(400).json({
            success: false,
            message: "Please provide the amount and transaction date."
        });

    }


    // =================================================
    // VALIDATE AMOUNT
    // =================================================

    const numericAmount = Number(amount);

    if (
        Number.isNaN(numericAmount) ||
        numericAmount <= 0
    ) {

        return res.status(400).json({
            success: false,
            message: "Amount must be greater than zero."
        });

    }


    // =================================================
    // VALIDATE CATEGORY
    // =================================================

    if (!category_id) {

        return res.status(400).json({
            success: false,
            message: "Please select a category."
        });

    }


    // =================================================
    // CHECK THAT CATEGORY IS AVAILABLE TO USER
    // =================================================
    //
    // A category can be:
    //
    // 1. Global       -> user_id IS NULL
    // 2. User custom  -> user_id = logged-in user
    //
    // A user cannot use another user's category.
    // =================================================

    const categorySql = `
        SELECT
            id,
            user_id,
            category_name,
            type
        FROM categories
        WHERE id = ?
          AND (
                user_id IS NULL
                OR user_id = ?
          )
        LIMIT 1
    `;


    db.query(
        categorySql,
        [category_id, user_id],
        (categoryError, categoryResults) => {

            if (categoryError) {

                console.error(
                    "Category lookup error:",
                    categoryError
                );

                return res.status(500).json({
                    success: false,
                    message: categoryError.message
                });

            }


            if (
                !categoryResults ||
                categoryResults.length === 0
            ) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Selected category is not available."
                });

            }


            const selectedCategory =
                categoryResults[0];


            // =================================================
            // FUNCTION TO CREATE TRANSACTION
            // =================================================

            const continueWithTransaction = (
                finalCategoryId
            ) => {

                Transaction.createTransaction(
                    {
                        user_id,
                        category_id: finalCategoryId,
                        amount: numericAmount,
                        description: description
                            ? description.trim()
                            : null,
                        transaction_date
                    },
                    (err) => {

                        if (err) {

                            console.error(
                                "Create transaction error:",
                                err
                            );

                            return res.status(500).json({
                                success: false,
                                message: err.message
                            });

                        }


                        return res.status(201).json({

                            success: true,

                            message:
                                "Transaction added successfully."

                        });

                    }
                );

            };


            // =================================================
            // NORMAL CATEGORY
            // =================================================
            //
            // If custom_category was not provided, simply use
            // the selected category.
            // =================================================

            if (!custom_category) {

                return continueWithTransaction(
                    selectedCategory.id
                );

            }


            // =================================================
            // CUSTOM CATEGORY NAME
            // =================================================

            const customCategoryName =
                custom_category.trim();


            // =================================================
            // VALIDATE CUSTOM CATEGORY NAME
            // =================================================

            if (!customCategoryName) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Please specify the category name."
                });

            }


            if (customCategoryName.length < 2) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Custom category must contain at least 2 characters."
                });

            }


            if (customCategoryName.length > 50) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Custom category must not exceed 50 characters."
                });

            }


            // =================================================
            // CUSTOM CATEGORY IS ONLY ALLOWED FOR "OTHER"
            // =================================================

            if (
                selectedCategory.category_name
                    .toLowerCase() !== "other"
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "A custom category can only be used with Other."
                });

            }


            // =================================================
            // DETERMINE TYPE
            // =================================================

            const categoryType =
                selectedCategory.type;


            // =================================================
            // CHECK IF CUSTOM CATEGORY ALREADY EXISTS
            // =================================================

            Transaction.findUserCategory(
                user_id,
                customCategoryName,
                categoryType,
                (findError, existingCategories) => {

                    if (findError) {

                        console.error(
                            "Find custom category error:",
                            findError
                        );

                        return res.status(500).json({
                            success: false,
                            message: findError.message
                        });

                    }


                    // =================================================
                    // EXISTING CUSTOM CATEGORY
                    // =================================================

                    if (
                        existingCategories &&
                        existingCategories.length > 0
                    ) {

                        const existingCategory =
                            existingCategories[0];

                        return continueWithTransaction(
                            existingCategory.id
                        );

                    }


                    // =================================================
                    // CREATE NEW CUSTOM CATEGORY
                    // =================================================

                    Transaction.createUserCategory(
                        user_id,
                        customCategoryName,
                        categoryType,
                        (createError, result) => {

                            if (createError) {

                                console.error(
                                    "Create custom category error:",
                                    createError
                                );

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        createError.message
                                });

                            }


                            // =================================================
                            // GET NEW CATEGORY ID
                            // =================================================

                            const newCategoryId =
                                result.insertId;


                            return continueWithTransaction(
                                newCategoryId
                            );

                        }
                    );

                }
            );

        }
    );

};


// =====================================================
// GET ALL TRANSACTIONS
// =====================================================

const getTransactions = (req, res) => {

    const user_id = req.user.id;

    Transaction.getTransactions(
        user_id,
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }

            res.status(200).json({

                success: true,
                transactions: results

            });

        }
    );

};


// =====================================================
// GET SINGLE TRANSACTION
// =====================================================

const getTransaction = (req, res) => {

    const user_id = req.user.id;

    Transaction.getTransactionById(
        req.params.id,
        user_id,
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }


            if (
                !results ||
                results.length === 0
            ) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Transaction not found."
                });

            }


            res.status(200).json({

                success: true,
                transaction: results[0]

            });

        }
    );

};


// =====================================================
// UPDATE TRANSACTION
// =====================================================

const updateTransaction = (req, res) => {

    const user_id = req.user.id;

    const {
        category_id,
        amount,
        description,
        transaction_date
    } = req.body;


    if (
        !category_id ||
        !amount ||
        !transaction_date
    ) {

        return res.status(400).json({
            success: false,
            message:
                "Please fill all required fields."
        });

    }


    const numericAmount = Number(amount);


    if (
        Number.isNaN(numericAmount) ||
        numericAmount <= 0
    ) {

        return res.status(400).json({
            success: false,
            message:
                "Amount must be greater than zero."
        });

    }


    // =================================================
    // VERIFY CATEGORY IS AVAILABLE TO USER
    // =================================================

    const categorySql = `
        SELECT id
        FROM categories
        WHERE id = ?
          AND (
                user_id IS NULL
                OR user_id = ?
          )
        LIMIT 1
    `;


    db.query(
        categorySql,
        [category_id, user_id],
        (categoryError, categoryResults) => {

            if (categoryError) {

                return res.status(500).json({
                    success: false,
                    message: categoryError.message
                });

            }


            if (
                !categoryResults ||
                categoryResults.length === 0
            ) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Selected category is not available."
                });

            }


            Transaction.updateTransaction(
                req.params.id,
                user_id,
                {
                    category_id,
                    amount: numericAmount,
                    description: description
                        ? description.trim()
                        : null,
                    transaction_date
                },
                (err, result) => {

                    if (err) {

                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });

                    }


                    if (
                        result &&
                        result.affectedRows === 0
                    ) {

                        return res.status(404).json({
                            success: false,
                            message:
                                "Transaction not found."
                        });

                    }


                    res.status(200).json({

                        success: true,

                        message:
                            "Transaction updated successfully."

                    });

                }
            );

        }
    );

};


// =====================================================
// DELETE TRANSACTION
// =====================================================

const deleteTransaction = (req, res) => {

    const user_id = req.user.id;

    Transaction.deleteTransaction(
        req.params.id,
        user_id,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }


            if (
                result &&
                result.affectedRows === 0
            ) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Transaction not found."
                });

            }


            res.status(200).json({

                success: true,

                message:
                    "Transaction deleted successfully."

            });

        }
    );

};


// =====================================================
// SEARCH TRANSACTIONS
// =====================================================

const searchTransactions = (req, res) => {

    const user_id = req.user.id;

    Transaction.searchTransactions(
        user_id,
        req.query,
        (err, results) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: err.message
                });

            }


            res.status(200).json({

                success: true,

                count: results.length,

                transactions: results

            });

        }
    );

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    addTransaction,

    getTransactions,

    getTransaction,

    updateTransaction,

    deleteTransaction,

    searchTransactions

};