const db = require("../config/db");

// ================= CREATE BUDGET =================

const createBudget = (budgetData, callback) => {

    const sql = `
        INSERT INTO budgets
        (user_id, month, year, budget_amount)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            budgetData.user_id,
            budgetData.month,
            budgetData.year,
            budgetData.budget_amount
        ],
        callback
    );

};

// ================= GET USER BUDGETS =================

const getBudgets = (user_id, callback) => {

    const sql = `
        SELECT *
        FROM budgets
        WHERE user_id = ?
        ORDER BY year DESC, month ASC
    `;

    db.query(sql, [user_id], callback);

};

// ================= GET SINGLE BUDGET =================

const getBudgetById = (id, user_id, callback) => {

    const sql = `
        SELECT *
        FROM budgets
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(sql, [id, user_id], callback);

};

// ================= UPDATE BUDGET =================

const updateBudget = (id, user_id, data, callback) => {

    const sql = `
        UPDATE budgets
        SET
            month = ?,
            year = ?,
            budget_amount = ?
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(
        sql,
        [
            data.month,
            data.year,
            data.budget_amount,
            id,
            user_id
        ],
        callback
    );

};

// ================= DELETE BUDGET =================

const deleteBudget = (id, user_id, callback) => {

    const sql = `
        DELETE FROM budgets
        WHERE id = ?
        AND user_id = ?
    `;

    db.query(sql, [id, user_id], callback);

};

module.exports = {

    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget

};