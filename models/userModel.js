const db = require("../config/db");


// =====================================================
// CREATE USER
// =====================================================

const createUser = (userData, callback) => {

    const sql = `
        INSERT INTO users (full_name, email, password, phone)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            userData.full_name,
            userData.email,
            userData.password,
            userData.phone
        ],
        callback
    );

};


// =====================================================
// FIND USER BY EMAIL
// =====================================================

const findByEmail = (email, callback) => {

    const sql = `
        SELECT * FROM users
        WHERE email = ?
    `;

    db.query(
        sql,
        [email],
        callback
    );

};


// =====================================================
// FIND USER BY ID
// =====================================================

const findById = (userId, callback) => {

    const sql = `
        SELECT * FROM users
        WHERE id = ?
    `;

    db.query(
        sql,
        [userId],
        callback
    );

};


// =====================================================
// UPDATE PROFILE
// =====================================================

const updateProfile = (
    userId,
    full_name,
    email,
    phone,
    callback
) => {

    const sql = `
        UPDATE users
        SET
            full_name = ?,
            email = ?,
            phone = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            full_name,
            email,
            phone,
            userId
        ],
        callback
    );

};

// =====================================================
// UPDATE PROFILE PICTURE
// =====================================================

const updateProfilePicture = (userId, picturePath, callback) => {

    const sql = `
        UPDATE users
        SET profile_picture = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [picturePath, userId],
        callback
    );

};

// =====================================================
// UPDATE PASSWORD
// =====================================================

const updatePassword = (
    userId,
    hashedPassword,
    callback
) => {

    const sql = `
        UPDATE users
        SET password = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            hashedPassword,
            userId
        ],
        callback
    );

};


// =====================================================
// SAVE PASSWORD RESET TOKEN
// =====================================================

const saveResetToken = (
    userId,
    resetToken,
    resetTokenExpires,
    callback
) => {

    const sql = `
        UPDATE users
        SET
            reset_token = ?,
            reset_token_expires = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            resetToken,
            resetTokenExpires,
            userId
        ],
        callback
    );

};


// =====================================================
// FIND USER BY RESET TOKEN
// =====================================================

const findByResetToken = (
    resetToken,
    callback
) => {

    const sql = `
        SELECT *
        FROM users
        WHERE reset_token = ?
        AND reset_token_expires > NOW()
    `;

    db.query(
        sql,
        [resetToken],
        callback
    );

};


// =====================================================
// CLEAR RESET TOKEN
// =====================================================

const clearResetToken = (
    userId,
    callback
) => {

    const sql = `
        UPDATE users
        SET
            reset_token = NULL,
            reset_token_expires = NULL
        WHERE id = ?
    `;

    db.query(
        sql,
        [userId],
        callback
    );

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createUser,

    findByEmail,

    findById,

    updateProfile,
    
    updateProfilePicture,

    updatePassword,

    saveResetToken,

    findByResetToken,

    clearResetToken

};