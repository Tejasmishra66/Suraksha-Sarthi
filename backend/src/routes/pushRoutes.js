const express = require("express");
const pushService = require("../services/pushService");
const auth = require("../middlewares/auth");
const env = require("../config/env");

const router = express.Router();

router.get("/vapid-public-key", (_req, res) => {
  res.send(env.vapidPublicKey || "");
});

router.post("/subscribe", auth, async (, ) => {
  const subscription = req.body;
  
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ message: "Invalid subscription" });
  }

  try {
    pushService.saveSubscription({
      userId: req.user.id,
      office: req.user.district,
      subscription
    });
    res.status(201).json({ message: "Subscription saved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to save subscription" });
  }
});

module.exports = router;
