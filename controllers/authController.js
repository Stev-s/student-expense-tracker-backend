const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("../models/userModel");

const {
    sendPasswordResetEmail
} = require("../utils/emailService");


// =====================================================
// REGISTER
// =====================================================

const registerUser = async (req, res) => {

    const {
        full_name,
        email,
        password,
        phone
    } = req.body;


    if (!full_name || !email || !password) {

        return res.status(400).json({

            success: false,

            message:
                "Please fill in all required fields."

        });

    }


    try {

        User.findByEmail(
            email,
            async (err, results) => {

                if (err) {

                    return res.status(500).json({

                        success: false,

                        message: err.message

                    });

                }


                if (results.length > 0) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Email already exists."

                    });

                }


                const hashedPassword =
                    await bcrypt.hash(
                        password,
                        10
                    );


                const user = {

                    full_name,

                    email,

                    password: hashedPassword,

                    phone

                };


                User.createUser(
                    user,
                    (err, result) => {

                        if (err) {

                            return res.status(500).json({

                                success: false,

                                message:
                                    err.message

                            });

                        }


                        res.status(201).json({

                            success: true,

                            message:
                                "User registered successfully."

                        });

                    }
                );

            }
        );

    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// =====================================================
// LOGIN
// =====================================================

const loginUser = (req, res) => {

    const {
        email,
        password
    } = req.body;


    if (!email || !password) {

        return res.status(400).json({

            success: false,

            message:
                "Email and password are required."

        });

    }


    User.findByEmail(
        email,
        async (err, results) => {

            if (err) {

                return res.status(500).json({

                    success: false,

                    message: err.message

                });

            }


            if (results.length === 0) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password."

                });

            }


            const user =
                results[0];


            const isMatch =
                await bcrypt.compare(
                    password,
                    user.password
                );


            if (!isMatch) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid email or password."

                });

            }


            const token =
                jwt.sign(

                    {
                        id: user.id,

                        email: user.email
                    },

                    process.env.JWT_SECRET,

                    {
                        // CHANGE THIS TO 10s FOR TESTING
                        expiresIn: "10m"
                    }

                );


            res.json({

                success: true,

                message:
                    "Login successful.",

                token,

                user: {

                    id: user.id,

                    full_name:
                        user.full_name,

                    email:
                        user.email,

                    phone:
                        user.phone

                }

            });

        }
    );

};



// =====================================================
// UPDATE PROFILE
// =====================================================

const updateProfile = (req, res) => {

    const userId =
        req.user.id;


    const {
        full_name,
        email,
        phone
    } = req.body;


    if (
        !full_name ||
        !email
    ) {

        return res.status(400).json({

            success: false,

            message:
                "Full name and email are required."

        });

    }


    const cleanName =
        full_name.trim();


    const cleanEmail =
        email.trim().toLowerCase();


    const cleanPhone =
        phone
            ? phone.trim()
            : null;


    if (cleanName.length < 2) {

        return res.status(400).json({

            success: false,

            message:
                "Full name must contain at least 2 characters."

        });

    }


    User.findByEmail(
        cleanEmail,
        (err, results) => {

            if (err) {

                return res.status(500).json({

                    success: false,

                    message: err.message

                });

            }


            if (
                results.length > 0 &&
                Number(results[0].id) !==
                    Number(userId)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Email already belongs to another account."

                });

            }


            User.updateProfile(

                userId,

                cleanName,

                cleanEmail,

                cleanPhone,

                (updateError, result) => {

                    if (updateError) {

                        console.error(
                            "Update profile error:",
                            updateError
                        );

                        return res.status(500).json({

                            success: false,

                            message:
                                updateError.message

                        });

                    }


                    if (
                        !result ||
                        result.affectedRows === 0
                    ) {

                        return res.status(404).json({

                            success: false,

                            message:
                                "User account not found."

                        });

                    }


                    return res.status(200).json({

                        success: true,

                        message:
                            "Profile updated successfully.",

                        user: {

                            id: userId,

                            full_name:
                                cleanName,

                            email:
                                cleanEmail,

                            phone:
                                cleanPhone

                        }

                    });

                }

            );

        }

    );

};



// =====================================================
// CHANGE PASSWORD
// =====================================================

const changePassword = async (req, res) => {

    try {

        const userId =
            req.user.id;


        const {
            currentPassword,
            newPassword
        } = req.body;


        if (
            !currentPassword ||
            !newPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Current password and new password are required."

            });

        }


        if (
            newPassword.length < 6
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must contain at least 6 characters."

            });

        }


        if (
            currentPassword ===
            newPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must be different from your current password."

            });

        }


        User.findById(
            userId,
            async (err, results) => {

                if (err) {

                    console.error(
                        "Find user error:",
                        err
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            err.message

                    });

                }


                if (
                    !results ||
                    results.length === 0
                ) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "User account not found."

                    });

                }


                const user =
                    results[0];


                const passwordMatch =
                    await bcrypt.compare(
                        currentPassword,
                        user.password
                    );


                if (!passwordMatch) {

                    return res.status(401).json({

                        success: false,

                        message:
                            "Current password is incorrect."

                    });

                }


                const hashedPassword =
                    await bcrypt.hash(
                        newPassword,
                        10
                    );


                User.updatePassword(
                    userId,
                    hashedPassword,
                    (updateError, result) => {

                        if (updateError) {

                            console.error(
                                "Update password error:",
                                updateError
                            );

                            return res.status(500).json({

                                success: false,

                                message:
                                    updateError.message

                            });

                        }


                        if (
                            !result ||
                            result.affectedRows === 0
                        ) {

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Password could not be changed."

                            });

                        }


                        return res.status(200).json({

                            success: true,

                            message:
                                "Password changed successfully."

                        });

                    }
                );

            }
        );

    } catch (error) {

        console.error(
            "Change password error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to change password."

        });

    }

};



// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword = async (req, res) => {

    try {

        const {
            email
        } = req.body;


        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!email) {

            return res.status(400).json({

                success: false,

                message:
                    "Email is required."

            });

        }


        const cleanEmail =
            email.trim().toLowerCase();


        // -------------------------------------------------
        // FIND USER
        // -------------------------------------------------

        User.findByEmail(
            cleanEmail,
            async (err, results) => {

                if (err) {

                    console.error(
                        "Find user for password reset error:",
                        err
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Unable to process password reset request."

                    });

                }


                // -------------------------------------------------
                // DO NOT REVEAL WHETHER EMAIL EXISTS
                // -------------------------------------------------

                if (
                    !results ||
                    results.length === 0
                ) {

                    return res.status(200).json({

                        success: true,

                        message:
                            "If an account exists with that email, a password reset link has been sent."

                    });

                }


                const user =
                    results[0];


                // -------------------------------------------------
                // GENERATE SECURE RESET TOKEN
                // -------------------------------------------------

                const resetToken =
                    crypto
                        .randomBytes(32)
                        .toString("hex");


                // -------------------------------------------------
                // TOKEN EXPIRY
                // 30 MINUTES
                // -------------------------------------------------

                const resetTokenExpiry =
                    new Date(
                        Date.now() +
                        30 * 60 * 1000
                    );


                // -------------------------------------------------
                // SAVE TOKEN
                // -------------------------------------------------

                User.saveResetToken(
                    user.id,
                    resetToken,
                    resetTokenExpiry,
                    async (saveError, result) => {

                        if (saveError) {

                            console.error(
                                "Save reset token error:",
                                saveError
                            );

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Unable to create password reset request."

                            });

                        }


                        // -------------------------------------------------
                        // SEND EMAIL
                        // -------------------------------------------------

                        try {

                            await sendPasswordResetEmail(

                                user.email,

                                user.full_name,

                                resetToken

                            );


                            return res.status(200).json({

                                success: true,

                                message:
                                    "If an account exists with that email, a password reset link has been sent."

                            });

                        } catch (emailError) {

                            console.error(
                                "Password reset email error:",
                                emailError
                            );


                            // -------------------------------------------------
                            // REMOVE TOKEN IF EMAIL FAILED
                            // -------------------------------------------------

                            User.clearResetToken(
                                user.id,
                                () => {}
                            );


                            return res.status(500).json({

                                success: false,

                                message:
                                    "Unable to send password reset email. Please try again later."

                            });

                        }

                    }
                );

            }
        );

    } catch (error) {

        console.error(
            "Forgot password error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to process password reset request."

        });

    }

};



// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async (req, res) => {

    try {

        const {
            token,
            newPassword
        } = req.body;


        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (
            !token ||
            !newPassword
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Reset token and new password are required."

            });

        }


        if (
            newPassword.length < 6
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "New password must contain at least 6 characters."

            });

        }


        // -------------------------------------------------
        // FIND VALID RESET TOKEN
        // -------------------------------------------------

        User.findByResetToken(
            token,
            async (err, results) => {

                if (err) {

                    console.error(
                        "Find reset token error:",
                        err
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Unable to verify reset token."

                    });

                }


                if (
                    !results ||
                    results.length === 0
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "This password reset link is invalid or has expired."

                    });

                }


                const user =
                    results[0];


                // -------------------------------------------------
                // HASH NEW PASSWORD
                // -------------------------------------------------

                const hashedPassword =
                    await bcrypt.hash(
                        newPassword,
                        10
                    );


                // -------------------------------------------------
                // UPDATE PASSWORD
                // -------------------------------------------------

                User.updatePassword(
                    user.id,
                    hashedPassword,
                    (updateError, result) => {

                        if (updateError) {

                            console.error(
                                "Reset password update error:",
                                updateError
                            );

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Unable to reset password."

                            });

                        }


                        if (
                            !result ||
                            result.affectedRows === 0
                        ) {

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Password could not be reset."

                            });

                        }


                        // -------------------------------------------------
                        // CLEAR RESET TOKEN
                        // -------------------------------------------------

                        User.clearResetToken(
                            user.id,
                            (clearError) => {

                                if (clearError) {

                                    console.error(
                                        "Clear reset token error:",
                                        clearError
                                    );

                                }

                            }
                        );


                        return res.status(200).json({

                            success: true,

                            message:
                                "Password reset successfully. You can now login with your new password."

                        });

                    }
                );

            }
        );

    } catch (error) {

        console.error(
            "Reset password error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to reset password."

        });

    }

};



// =====================================================
// EXPORT
// =====================================================

module.exports = {

    registerUser,

    loginUser,

    updateProfile,

    changePassword,

    forgotPassword,

    resetPassword

};