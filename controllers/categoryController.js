const Category = require("../models/categoryModel");

// =====================================================
// GET ALL AVAILABLE CATEGORIES
// =====================================================
// Returns global categories that are available to every user.
// =====================================================

const getCategories = (req, res) => {

    Category.getCategories((err, results) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: err.message
            });

        }

        res.status(200).json({

            success: true,
            categories: results

        });

    });

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    getCategories

};