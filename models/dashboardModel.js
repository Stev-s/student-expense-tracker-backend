const db = require("../config/db");

// Dashboard Summary
const getDashboardSummary = (user_id, callback) => {

    const sql = `
        SELECT
            COUNT(t.id) AS totalTransactions,

            SUM(
                CASE
                    WHEN c.type = 'Income'
                    THEN t.amount
                    ELSE 0
                END
            ) AS totalIncome,

            SUM(
                CASE
                    WHEN c.type = 'Expense'
                    THEN t.amount
                    ELSE 0
                END
            ) AS totalExpense

        FROM transactions t
        JOIN categories c
        ON t.category_id = c.id

        WHERE t.user_id = ?
    `;

    db.query(sql, [user_id], callback);

};

module.exports = {
    getDashboardSummary
};