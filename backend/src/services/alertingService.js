const { db } = require("../db/database");
const alertModel = require("../models/alertModel");
const volunteerModel = require("../models/volunteerModel");
const { haversineKm } = require("../utils/geo");
const { sendSms } = require("./smsService");
const pushService = require("./pushService");

const DISASTER_TO_SKILLS = {
	Flood: ["SAR", "Medical", "Debris"],
	Earthquake: ["SAR", "FMR", "Medical"],
	Landslide: ["SAR", "Debris"],
	Cyclone: ["SAR", "Utility", "Connectivity"],
	Fire: ["SAR", "Medical"],
	default: []
};

async function () {
	// Normalizes comma-separated capability tags for matching.
	return String(skills || "")
		.split(",")
		.map((skill) => skill.trim().toLowerCase())
		.filter(Boolean);
}

async function () {
	// Loads agency head accounts for alert escalation and routing.
	return db.prepare("SELECT * FROM users WHERE role = 'agency_head'").all();
}

async function () {
	// Returns active volunteers inside a geofence with matching capability tags.
	const volunteers = await );
	const required = requiredSkills.map((skill) => String(skill).toLowerCase());

	return volunteers.filter((volunteer) => {
		const distance = haversineKm(Number(lat), Number(lng), Number(volunteer.lat), Number(volunteer.lng));
		if (distance > Number(radiusKm)) {
			return false;
		}

		const capabilities = normalizeSkills(volunteer.capabilities);
		return required.length === 0 || required.some((skill) => capabilities.includes(skill));
	});
}

async function () {
	// Creates the alert row, dispatches volunteer notifications, and records recipients.
	if (!disasterType || lat == null || lng == null) {
		const error = new Error("disasterType, lat, and lng are required");
		error.statusCode = 400;
		throw error;
	}

	const alertResult = await {
		disasterType,
		lat: Number(lat),
		lng: Number(lng),
		radiusKm: Number(radiusKm),
		severity,
		createdBy,
        officeTags
	});

	const alertId = alertResult.lastInsertRowid;
	const requiredSkills = DISASTER_TO_SKILLS[disasterType] || DISASTER_TO_SKILLS.default;
	const volunteers = findVolunteersInRadius(lat, lng, radiusKm, requiredSkills);

	volunteers.forEach((volunteer) => {
		await {
			alertId,
			volunteerId: volunteer.id,
			channel: "sms"
		});
		sendSms(volunteer.phone, `SDRF alert: ${disasterType} near your area. Please respond in the app.`);
	});

	const agencyHeads = getAgencyHeads();
	agencyHeads.forEach((user) => {
		await {
			alertId,
			userId: user.id,
			channel: "app"
		});
	});

    pushService.notifyOffices(officeTags || ["State"], {
        title: "New High Priority Alert",
        body: `${disasterType} alert created. Please review.`,
        url: "/map"
    }).catch(e => console.error("Push Error:", e));

	return {
		alertId,
		recipientsCount: volunteers.length + agencyHeads.length,
		matchedVolunteerIds: volunteers.map((volunteer) => volunteer.id)
	};
}

async function () {
	// Returns current recipient matrix for an alert.
	return await alertId);
}

async function () {
	// Marks a recipient as responded so escalation will not re-notify them.
	if (!volunteerId && !userId) {
		const error = new Error("volunteerId or userId is required");
		error.statusCode = 400;
		throw error;
	}

	return await alertId, volunteerId, userId);
}

async function () {
	// Returns a lightweight alert pin list for map canvas rendering.
	return await );
}

async function () {
	// Escalates alerts without responses after five minutes.
	setInterval(() => {
		const staleAlerts = await );
		const agencyHeads = getAgencyHeads();

		staleAlerts.forEach((alert) => {
			const responseCount = await alert.id);
			if (responseCount > 0) {
				return;
			}

			await alert.id);

			agencyHeads.forEach((user) => {
				await {
					alertId: alert.id,
					userId: user.id,
					channel: "escalation_sms"
				});

				// Use the actual phone number from the agency head's user record.
				// Skip silently if no phone is registered rather than calling a placeholder.
				if (user.phone) {
					sendSms(
						user.phone,
						`SDRF Escalation: Alert #${alert.id} (${alert.disaster_type}) has had no response for 5 minutes. Immediate action required.`
					);
				}
			});
		});
	}, 60 * 1000);
}

module.exports = {
	createAlertAndNotify,
	getAlertRecipients,
	markAlertResponse,
	listAlertsForMap,
	findVolunteersInRadius,
	startEscalationMonitor
};
