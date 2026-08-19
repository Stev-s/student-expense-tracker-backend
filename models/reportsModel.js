const db = require("../config/db");

// ================= MONTHLY REPORT =================

const getMonthlyReport = (user_id, callback) => {

    const sql = `
        SELECT
            DATE_FORMAT(t.transaction_date, '%Y-%m') AS month,

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

        GROUP BY DATE_FORMAT(t.transaction_date, '%Y-%m')

        ORDER BY month DESC
    `;

    db.query(sql, [user_id], callback);

};

// ================= CATEGORY REPORT =================

const getCategoryReport = (user_id, callback) => {

    const sql = `
        SELECT
            c.category_name,
            c.type,
            SUM(t.amount) AS totalAmount

        FROM transactions t
        JOIN categories c
            ON t.category_id = c.id

        WHERE t.user_id = ?

        GROUP BY c.id, c.category_name, c.type

        ORDER BY totalAmount DESC
    `;

    db.query(sql, [user_id], callback);

};

// ================= DATE RANGE REPORT =================

const getDateRangeReport = (user_id, startDate, endDate, callback) => {

    const sql = `
        SELECT
            t.*,
            c.category_name,
            c.type

        FROM transactions t
        JOIN categories c
            ON t.category_id = c.id

        WHERE
            t.user_id = ?
            AND t.transaction_date BETWEEN ? AND ?

        ORDER BY t.transaction_date DESC
    `;

    db.query(
        sql,
        [
            user_id,
            startDate,
            endDate
        ],
        callback
    );

};

module.exports = {
    getMonthlyReport,
    getCategoryReport,
    getDateRangeReport
};