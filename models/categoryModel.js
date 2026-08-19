const db = require("../config/db");

// =====================================================
// GET ALL AVAILABLE CATEGORIES
// =====================================================
// Returns only global categories.
// Global categories have user_id = NULL.
// Therefore, every registered user can access them.
// =====================================================

const getCategories = (callback) => {

    const sql = `
        SELECT
            id,
            user_id,
            category_name,
            type,
            created_at
        FROM categories
        WHERE user_id IS NULL
        ORDER BY
            type,
            category_name ASC
    `;

    db.query(sql, callback);

};


module.exports = {

    getCategories

};