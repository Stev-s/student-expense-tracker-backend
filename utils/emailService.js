const { BrevoClient } = require("@getbrevo/brevo");


// =====================================================
// BREVO CLIENT
// =====================================================

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});


// =====================================================
// SEND PASSWORD RESET EMAIL
// =====================================================

const sendPasswordResetEmail = async (
    email,
    fullName,
    resetToken
) => {

    try {

        // -------------------------------------------------
        // CREATE RESET LINK
        // -------------------------------------------------

        const resetUrl =
            `${process.env.APP_RESET_URL}?token=${resetToken}`;


        // -------------------------------------------------
        // EMAIL CONTENT
        // -------------------------------------------------

        const htmlContent = `

            <!DOCTYPE html>

            <html>

            <head>

                <meta charset="UTF-8">

                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0">

                <title>Password Reset</title>

            </head>


            <body
                style="
                    margin: 0;
                    padding: 0;
                    background-color: #f5f5f5;
                    font-family: Arial, sans-serif;
                "
            >

                <div
                    style="
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        padding: 30px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                    "
                >

                    <h2
                        style="
                            color: #111827;
                            margin-bottom: 20px;
                        "
                    >
                        Student Expense Tracker
                    </h2>


                    <p
                        style="
                            color: #374151;
                            font-size: 16px;
                        "
                    >
                        Hello ${fullName || "there"},
                    </p>


                    <p
                        style="
                            color: #374151;
                            font-size: 16px;
                            line-height: 1.6;
                        "
                    >
                        We received a request to reset the password
                        for your Student Expense Tracker account.
                    </p>


                    <p
                        style="
                            color: #374151;
                            font-size: 16px;
                            line-height: 1.6;
                        "
                    >
                        Click the button below to create a new password.
                    </p>


                    <div
                        style="
                            text-align: center;
                            margin: 30px 0;
                        "
                    >

                        <a
                            href="${resetUrl}"
                            style="
                                display: inline-block;
                                background-color: #2563eb;
                                color: #ffffff;
                                text-decoration: none;
                                padding: 14px 24px;
                                border-radius: 8px;
                                font-weight: bold;
                            "
                        >
                            Reset Password
                        </a>

                    </div>


                    <p
                        style="
                            color: #6b7280;
                            font-size: 14px;
                            line-height: 1.6;
                        "
                    >
                        If you did not request a password reset,
                        you can safely ignore this email.
                    </p>


                    <p
                        style="
                            color: #6b7280;
                            font-size: 14px;
                            line-height: 1.6;
                        "
                    >
                        For security reasons, this password reset
                        link should only be used once.
                    </p>


                    <hr
                        style="
                            border: none;
                            border-top: 1px solid #e5e7eb;
                            margin: 30px 0;
                        "
                    >


                    <p
                        style="
                            color: #9ca3af;
                            font-size: 12px;
                            text-align: center;
                        "
                    >
                        Student Expense Tracker
                    </p>

                </div>

            </body>

            </html>

        `;


        // -------------------------------------------------
        // SEND EMAIL THROUGH BREVO
        // -------------------------------------------------

        const result =
            await brevo.transactionalEmails.sendTransacEmail({

                sender: {

                    name:
                        process.env.BREVO_SENDER_NAME,

                    email:
                        process.env.BREVO_SENDER_EMAIL,

                },

                to: [

                    {

                        email: email,

                        name:
                            fullName || "Student",

                    },

                ],

                subject:
                    "Reset Your Student Expense Tracker Password",

                htmlContent,

            });


        console.log(
            "Password reset email sent:",
            result.messageId
        );


        return result;

    } catch (error) {

        console.error(
            "Brevo password reset email error:",
            error
        );

        throw error;

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    sendPasswordResetEmail,

};