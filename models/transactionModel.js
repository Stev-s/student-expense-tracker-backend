const db = require("../config/db");

// =====================================================
// CREATE TRANSACTION
// =====================================================

const createTransaction = (transactionData, callback) => {

    const sql = `
        INSERT INTO transactions
        (
            user_id,
            category_id,
            amount,
            description,
            transaction_date
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            transactionData.user_id,
            transactionData.category_id,
            transactionData.amount,
            transactionData.description || null,
            transactionData.transaction_date
        ],
        callback
    );

};


// =====================================================
// GET ALL TRANSACTIONS
// =====================================================

const getTransactions = (user_id, callback) => {

    const sql = `
        SELECT
            t.*,
            c.category_name,
            c.type
        FROM transactions t

        JOIN categories c
            ON t.category_id = c.id

        WHERE t.user_id = ?

        ORDER BY
            t.transaction_date DESC,
            t.id DESC
    `;

    db.query(
        sql,
        [user_id],
        callback
    );

};


// =====================================================
// GET SINGLE TRANSACTION
// =====================================================

const getTransactionById = (
    id,
    user_id,
    callback
) => {

    const sql = `
        SELECT
            t.*,
            c.category_name,
            c.type
        FROM transactions t

        JOIN categories c
            ON t.category_id = c.id

        WHERE
            t.id = ?
            AND t.user_id = ?
    `;

    db.query(
        sql,
        [
            id,
            user_id
        ],
        callback
    );

};


// =====================================================
// UPDATE TRANSACTION
// =====================================================

const updateTransaction = (
    id,
    user_id,
    data,
    callback
) => {

    const sql = `
        UPDATE transactions

        SET
            category_id = ?,
            amount = ?,
            description = ?,
            transaction_date = ?

        WHERE
            id = ?
            AND user_id = ?
    `;

    db.query(
        sql,
        [
            data.category_id,
            data.amount,
            data.description || null,
            data.transaction_date,
            id,
            user_id
        ],
        callback
    );

};


// =====================================================
// DELETE TRANSACTION
// =====================================================

const deleteTransaction = (
    id,
    user_id,
    callback
) => {

    const sql = `
        DELETE FROM transactions

        WHERE
            id = ?
            AND user_id = ?
    `;

    db.query(
        sql,
        [
            id,
            user_id
        ],
        callback
    );

};


// =====================================================
// FIND CUSTOM CATEGORY
// =====================================================
// Finds a category belonging to the current user.
//
// Global categories (user_id IS NULL) are NOT returned
// here because this function is specifically for custom
// user categories.
// =====================================================

const findUserCategory = (
    user_id,
    category_name,
    type,
    callback
) => {

    const sql = `
        SELECT
            id,
            user_id,
            category_name,
            type

        FROM categories

        WHERE
            user_id = ?
            AND LOWER(category_name) = LOWER(?)
            AND type = ?

        LIMIT 1
    `;

    db.query(
        sql,
        [
            user_id,
            category_name,
            type
        ],
        callback
    );

};


// =====================================================
// CREATE CUSTOM CATEGORY
// =====================================================

const createUserCategory = (
    user_id,
    category_name,
    type,
    callback
) => {

    const sql = `
        INSERT INTO categories
        (
            user_id,
            category_name,
            type
        )
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            user_id,
            category_name,
            type
        ],
        callback
    );

};


// =====================================================
// SEARCH & FILTER TRANSACTIONS
// =====================================================

const searchTransactions = (
    user_id,
    filters,
    callback
) => {

    let sql = `
        SELECT
            t.*,
            c.category_name,
            c.type

        FROM transactions t

        JOIN categories c
            ON t.category_id = c.id

        WHERE t.user_id = ?
    `;

    const values = [user_id];


    // =================================================
    // DESCRIPTION SEARCH
    // =================================================

    if (filters.description) {

        sql += `
            AND t.description LIKE ?
        `;

        values.push(
            `%${filters.description}%`
        );

    }


    // =================================================
    // CATEGORY FILTER
    // =================================================

    if (filters.category) {

        sql += `
            AND c.category_name = ?
        `;

        values.push(
            filters.category
        );

    }


    // =================================================
    // TYPE FILTER
    // =================================================

    if (filters.type) {

        sql += `
            AND c.type = ?
        `;

        values.push(
            filters.type
        );

    }


    // =================================================
    // DATE FILTER
    // =================================================

    if (
        filters.startDate &&
        filters.endDate
    ) {

        sql += `
            AND t.transaction_date
            BETWEEN ? AND ?
        `;

        values.push(
            filters.startDate,
            filters.endDate
        );

    }


    // =================================================
    // SORT
    // =================================================

    sql += `
        ORDER BY
            t.transaction_date DESC,
            t.id DESC
    `;


    db.query(
        sql,
        values,
        callback
    );

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createTransaction,

    getTransactions,

    getTransactionById,

    updateTransaction,

    deleteTransaction,

    findUserCategory,

    createUserCategory,

    searchTransactions

};