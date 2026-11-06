
const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    getPublicKey,
    subscribe,
    unsubscribe,
    sendTestNotification
} = require("../controllers/pushController");

// The public VAPID key is not secret.
router.get("/public-key", getPublicKey);

// These operations require a signed-in user.
router.post("/subscribe", verifyToken, subscribe);
router.post("/unsubscribe", verifyToken, unsubscribe);
router.post("/test", verifyToken, sendTestNotification);

module.exports = router;
