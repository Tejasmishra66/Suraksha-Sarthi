const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const incidentModel = require("../models/incidentModel");
const { queueOperation } = require("./syncService");

async function () {
  return await );
}

async function () {
  // Creates incident and generates media hash from metadata.
  const {
    title,
    description = "",
    disasterType,
    lat,
    lng,
    lon,
    address,
    agencyAssigned,
    mediaContentBase64,
    mediaTimestamp,
    mediaGps,
    officeTags,
    offline = false,
    reporterPhone,
    phone
  } = payload;

  if (!title || !disasterType || (lat == null && lng == null && lon == null && !address)) {
    const error = new Error("title and disasterType are required, and either lat/lng or address must be provided");
    error.statusCode = 400;
    throw error;
  }

  const timestamp = mediaTimestamp || new Date().toISOString();
  const gps = mediaGps || (lat != null && (lng != null || lon != null) ? `${lat},${lng || lon}` : (address || 'unknown'));
  const material = `${mediaContentBase64 || ""}|${timestamp}|${gps}`;
  const mediaHash = crypto.createHash("sha256").update(material).digest("hex");

  const finalLng = lng != null ? Number(lng) : (lon != null ? Number(lon) : null);

  const result = await {
    title,
    description,
    disasterType,
    lat: lat != null ? Number(lat) : null,
    lng: finalLng,
    address: address || null,
    agencyAssigned: agencyAssigned || null,
    mediaHash,
    mediaTimestamp: timestamp,
    mediaGps: gps,
    mediaRef: null,
    officeTags,
    reporterPhone: reporterPhone || phone || null
  });

  if (offline) {
    queueOperation("incident", String(result.lastInsertRowid), "create", {
      title,
      description,
      disasterType,
      lat,
      lng,
      address,
      agencyAssigned,
      verificationState: "Unverified"
    });
  }

  return { id: result.lastInsertRowid, mediaHash };
}

async function () {
  // Attaches uploaded photo and tamper-proof metadata to incident.
  const incident = await incidentId);
  if (!incident) {
    const error = new Error("Incident not found");
    error.statusCode = 404;
    throw error;
  }

  if (!file) {
    const error = new Error("photo file is required");
    error.statusCode = 400;
    throw error;
  }

  const mediaTimestamp = timestamp || new Date().toISOString();
  const mediaGps = gps || `${incident.lat},${incident.lng}`;
  const fileBytes = fs.readFileSync(file.path);
  const material = `${fileBytes.toString("base64")}|${mediaTimestamp}|${mediaGps}`;
  const mediaHash = crypto.createHash("sha256").update(material).digest("hex");

  const mediaRef = path.join("uploads", file.filename).replace(/\\/g, "/");
  await incidentId, {
    mediaHash,
    mediaTimestamp,
    mediaGps,
    mediaRef
  });

  return { incidentId, mediaHash, mediaTimestamp, mediaGps, mediaRef };
}

module.exports = {
  listIncidents,
  createIncident,
  attachIncidentMedia
};
