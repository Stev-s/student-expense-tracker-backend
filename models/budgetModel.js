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

// ================= GET CURRENT MONTH BUDGET STATUS =================

const getCurrentBudgetStatus = (
    user_id,
    monthName,
    monthNumber,
    year,
    callback
) => {
    const sql = `
        SELECT
            b.id AS budget_id,
            b.month,
            b.year,
            b.budget_amount,
            COALESCE(SUM(
                CASE
                    WHEN c.type = 'Expense' THEN t.amount
                    ELSE 0
                END
            ), 0) AS total_expenses
        FROM budgets b
        LEFT JOIN transactions t
            ON t.user_id = b.user_id
            AND YEAR(t.transaction_date) = b.year
            AND MONTH(t.transaction_date) = ?
        LEFT JOIN categories c
            ON c.id = t.category_id
            AND c.type = 'Expense'
        WHERE b.user_id = ?
            AND b.year = ?
            AND (
                LOWER(TRIM(b.month)) = LOWER(?)
                OR CAST(b.month AS UNSIGNED) = ?
            )
        GROUP BY
            b.id,
            b.month,
            b.year,
            b.budget_amount
        ORDER BY b.id DESC
        LIMIT 1
    `;

    db.query(
        sql,
        [
            monthNumber,
            user_id,
            year,
            monthName,
            monthNumber
        ],
        callback
    );
};

module.exports = {

    createBudget,
    getBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
    getCurrentBudgetStatus

};