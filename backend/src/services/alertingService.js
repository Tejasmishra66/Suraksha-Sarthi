const { db } = require("../db/database");
const alertModel = require("../models/alertModel");
const volunteerModel = require("../models/volunteerModel");
const { haversineKm } = require("../utils/geo");
const { sendSms } = require("./smsService");

const DISASTER_TO_SKILLS = {
	Flood: ["SAR", "Medical", "Debris"],
	Earthquake: ["SAR", "FMR", "Medical"],
	Landslide: ["SAR", "Debris"],
	Cyclone: ["SAR", "Utility", "Connectivity"],
	Fire: ["SAR", "Medical"],
	default: []
};

function normalizeSkills(skills) {
	// Normalizes comma-separated capability tags for matching.
	return String(skills || "")
		.split(",")
		.map((skill) => skill.trim().toLowerCase())
		.filter(Boolean);
}

function getAgencyHeads() {
	// Loads agency head accounts for alert escalation and routing.
	return db.prepare("SELECT * FROM users WHERE role = 'agency_head'").all();
}

function findVolunteersInRadius(lat, lng, radiusKm, requiredSkills = []) {
	// Returns active volunteers inside a geofence with matching capability tags.
	const volunteers = volunteerModel.listActiveVolunteers();
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

function createAlertAndNotify({ disasterType, lat, lng, radiusKm = 10, severity = "medium", createdBy }) {
	// Creates the alert row, dispatches volunteer notifications, and records recipients.
	if (!disasterType || lat == null || lng == null) {
		const error = new Error("disasterType, lat, and lng are required");
		error.statusCode = 400;
		throw error;
	}

	const alertResult = alertModel.createAlert({
		disasterType,
		lat: Number(lat),
		lng: Number(lng),
		radiusKm: Number(radiusKm),
		severity,
		createdBy
	});

	const alertId = alertResult.lastInsertRowid;
	const requiredSkills = DISASTER_TO_SKILLS[disasterType] || DISASTER_TO_SKILLS.default;
	const volunteers = findVolunteersInRadius(lat, lng, radiusKm, requiredSkills);

	volunteers.forEach((volunteer) => {
		alertModel.createAlertRecipient({
			alertId,
			volunteerId: volunteer.id,
			channel: "sms"
		});
		sendSms(volunteer.phone, `SDRF alert: ${disasterType} near your area. Please respond in the app.`);
	});

	const agencyHeads = getAgencyHeads();
	agencyHeads.forEach((user) => {
		alertModel.createAlertRecipient({
			alertId,
			userId: user.id,
			channel: "app"
		});
	});

	return {
		alertId,
		recipientsCount: volunteers.length + agencyHeads.length,
		matchedVolunteerIds: volunteers.map((volunteer) => volunteer.id)
	};
}

function getAlertRecipients(alertId) {
	// Returns current recipient matrix for an alert.
	return alertModel.listAlertRecipients(alertId);
}

function markAlertResponse(alertId, volunteerId, userId) {
	// Marks a recipient as responded so escalation will not re-notify them.
	if (!volunteerId && !userId) {
		const error = new Error("volunteerId or userId is required");
		error.statusCode = 400;
		throw error;
	}

	return alertModel.markRecipientResponded(alertId, volunteerId, userId);
}

function listAlertsForMap() {
	// Returns a lightweight alert pin list for map canvas rendering.
	return alertModel.listAlertsForMap();
}

function startEscalationMonitor() {
	// Escalates alerts without responses after five minutes.
	setInterval(() => {
		const staleAlerts = alertModel.listStaleAlerts();
		const agencyHeads = getAgencyHeads();

		staleAlerts.forEach((alert) => {
			const responseCount = alertModel.countResponses(alert.id);
			if (responseCount > 0) {
				return;
			}

			alertModel.markAlertEscalated(alert.id);

			agencyHeads.forEach((user) => {
				alertModel.createAlertRecipient({
					alertId: alert.id,
					userId: user.id,
					channel: "escalation_sms"
				});

				sendSms(
					"+910000000000",
					`Escalation: alert ${alert.id} (${alert.disaster_type}) has no response in 5 minutes.`
				);
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
