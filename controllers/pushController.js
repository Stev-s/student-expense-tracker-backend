
const webpush = require("web-push");
const PushSubscription = require("../models/pushSubscriptionModel");

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.warn("Web Push VAPID keys are not configured.");
} else {
    webpush.setVapidDetails(
        process.env.VAPID_SUBJECT || "mailto:admin@example.com",
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

// Public key used by the browser to create a push subscription.
const getPublicKey = (req, res) => {
    if (!process.env.VAPID_PUBLIC_KEY) {
        return res.status(503).json({
            success: false,
            message: "Push notifications are not configured."
        });
    }

    res.json({
        success: true,
        publicKey: process.env.VAPID_PUBLIC_KEY
    });
};

// Save the current user's browser subscription.
const subscribe = (req, res) => {
    const userId = req.user.id;
    const subscription = req.body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
        return res.status(400).json({
            success: false,
            message: "A valid browser push subscription is required."
        });
    }

    PushSubscription.saveSubscription(userId, subscription, (err) => {
        if (err) {
            console.error("Saving push subscription failed:", err.message);
            return res.status(500).json({
                success: false,
                message: "Could not save the push subscription."
            });
        }

        res.status(201).json({
            success: true,
            message: "Push subscription saved."
        });
    });
};

// Remove the current user's browser subscription.
const unsubscribe = (req, res) => {
    const userId = req.user.id;
    const endpoint = req.body?.endpoint;

    if (!endpoint || typeof endpoint !== "string") {
        return res.status(400).json({
            success: false,
            message: "The subscription endpoint is required."
        });
    }

    PushSubscription.deleteSubscription(userId, endpoint, (err) => {
        if (err) {
            console.error("Removing push subscription failed:", err.message);
            return res.status(500).json({
                success: false,
                message: "Could not remove the push subscription."
            });
        }

        res.json({
            success: true,
            message: "Push subscription removed."
        });
    });
};

// Send a test push to every browser registered by the current user.
const sendTestNotification = (req, res) => {
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
        return res.status(503).json({
            success: false,
            message: "Push notifications are not configured."
        });
    }

    PushSubscription.getSubscriptionsByUser(req.user.id, async (err, rows) => {
        if (err) {
            console.error("Loading push subscriptions failed:", err.message);
            return res.status(500).json({
                success: false,
                message: "Could not load push subscriptions."
            });
        }

        if (!rows || rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No browser is subscribed. Enable notifications on your phone first."
            });
        }

        const payload = JSON.stringify({
            title: "Student Expense Tracker",
            body: "Test notification received. Push notifications are connected!",
            url: "/"
        });

        const results = await Promise.allSettled(
            rows.map((row) => {
                const subscription = {
                    endpoint: row.endpoint,
                    keys: {
                        p256dh: row.p256dh_key,
                        auth: row.auth_key
                    }
                };

                return webpush.sendNotification(subscription, payload);
            })
        );

        const successful = results.filter(
            (result) => result.status === "fulfilled"
        ).length;

        // Remove subscriptions that push services report as expired.
        const expired = results
            .map((result, index) => ({ result, row: rows[index] }))
            .filter(({ result }) =>
                result.status === "rejected" &&
                [404, 410].includes(result.reason?.statusCode)
            );

        await Promise.all(
            expired.map(({ row }) =>
                new Promise((resolve) => {
                    PushSubscription.deleteSubscription(
                        req.user.id,
                        row.endpoint,
                        () => resolve()
                    );
                })
            )
        );

        if (successful === 0) {
            console.error(
                "All push deliveries failed:",
                results
                    .filter((result) => result.status === "rejected")
                    .map((result) => result.reason?.message)
            );

            return res.status(502).json({
                success: false,
                message: "Push delivery failed. Check the backend logs."
            });
        }

        res.json({
            success: true,
            message: "Test push sent to the push service.",
            deliveredToPushService: successful
        });
    });
};

module.exports = {
    getPublicKey,
    subscribe,
    unsubscribe,
    sendTestNotification
};
