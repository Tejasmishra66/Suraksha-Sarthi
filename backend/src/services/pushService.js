const webpush = require("web-push");
const { db } = require("../db/database");
const env = require("../config/env");
const logger = require("../utils/logger");

// Initialize web-push if keys are available
try {
  if (env.vapidPublicKey && env.vapidPrivateKey && env.vapidPublicKey !== "BPl-..." && env.vapidPrivateKey !== "...") {
    webpush.setVapidDetails(
      "mailto:admin@sdrf.local",
      env.vapidPublicKey,
      env.vapidPrivateKey
    );
  } else {
    logger.warn("VAPID keys not configured or using placeholders. Push notifications will be disabled.");
  }
} catch (err) {
  logger.error("Failed to initialize web-push", err);
}

async function () {
  try {
    return db
      .prepare(
        `INSERT INTO web_push_subscriptions (user_id, office, endpoint, p256dh, auth) 
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(endpoint) DO UPDATE SET user_id=excluded.user_id, office=excluded.office`
      )
      .run(userId, office, subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth);
  } catch (error) {
    logger.error("Failed to save push subscription", error);
    throw error;
  }
}

async function () {
  if (!offices || offices.length === 0) return [];
  const placeholders = offices.map(() => "?").join(", ");
  return db
    .prepare(`SELECT * FROM web_push_subscriptions WHERE office IN (${placeholders}) OR office = 'State' OR office = 'All'`)
    .all(...offices);
}

async function sendPushNotification(subscriptionRow, payload) {
  if (!env.vapidPublicKey || !env.vapidPrivateKey) return;

  const pushSubscription = {
    endpoint: subscriptionRow.endpoint,
    keys: {
      p256dh: subscriptionRow.p256dh,
      auth: subscriptionRow.auth
    }
  };

  try {
    await webpush.sendNotification(pushSubscription, JSON.stringify(payload));
  } catch (error) {
    if (error.statusCode === 410 || error.statusCode === 404) {
      // Subscription has expired or is no longer valid
      db.prepare("DELETE FROM web_push_subscriptions WHERE endpoint = ?").run(subscriptionRow.endpoint);
    } else {
      logger.error("Error sending push notification", error);
    }
  }
}

async function notifyOffices(offices, payload) {
  const subscriptions = getSubscriptionsByOffices(offices);
  const promises = subscriptions.map(sub => sendPushNotification(sub, payload));
  await Promise.allSettled(promises);
}

module.exports = {
  saveSubscription,
  notifyOffices
};
