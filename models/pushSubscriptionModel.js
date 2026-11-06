
const db = require("../config/db");
const crypto = require("crypto");

// Save or update a browser's push subscription.
const saveSubscription = (userId, subscription, callback) => {
    const endpoint = subscription.endpoint;
    const p256dh = subscription.keys?.p256dh;
    const auth = subscription.keys?.auth;

    if (!endpoint || !p256dh || !auth) {
        return callback(new Error("Invalid push subscription."));
    }

    const endpointHash = crypto
        .createHash("sha256")
        .update(endpoint)
        .digest("hex");

    const sql = `
        INSERT INTO push_subscriptions
            (user_id, endpoint_hash, endpoint, p256dh_key, auth_key)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
    user_id = VALUES(user_id),
    endpoint = VALUES(endpoint),
    p256dh_key = VALUES(p256dh_key),
    auth_key = VALUES(auth_key)
    `;

    db.query(
        sql,
        [userId, endpointHash, endpoint, p256dh, auth],
        callback
    );
};

// Retrieve subscriptions belonging to one user.
const getSubscriptionsByUser = (userId, callback) => {
    const sql = `
        SELECT id, endpoint, p256dh_key, auth_key
        FROM push_subscriptions
        WHERE user_id = ?
    `;

    db.query(sql, [userId], callback);
};

// Remove one subscription belonging to its owner.
const deleteSubscription = (userId, endpoint, callback) => {
    const endpointHash = crypto
        .createHash("sha256")
        .update(endpoint)
        .digest("hex");

    const sql = `
        DELETE FROM push_subscriptions
        WHERE user_id = ? AND endpoint_hash = ?
    `;

    db.query(sql, [userId, endpointHash], callback);
};

module.exports = {
    saveSubscription,
    getSubscriptionsByUser,
    deleteSubscription
};
