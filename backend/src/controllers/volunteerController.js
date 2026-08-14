const volunteerModel = require("../models/volunteerModel");

async function () {
  return res.json(await ));
}

async function () {
  const { findVolunteersInRadius } = require("../services/alertingService");
  const { lat, lng, radiusKm, skills = [] } = req.body;
  if (lat == null || lng == null) {
    return res.status(400).json({ message: "lat and lng are required" });
  }
  const matches = findVolunteersInRadius(Number(lat), Number(lng), Number(radiusKm || 10), skills);
  return res.json({ total: matches.length, matches });
}

async function () {
  // Attach the user_id from JWT if available
  const userId = req.user?.id || null;
  const result = await { ...req.body, user_id: userId });
  return res.status(201).json({ id: result.lastInsertRowid });
}

// GET /volunteers/me — returns current user's volunteer profile
async function () {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Not authenticated" });
  const profile = await userId);
  if (!profile) return res.status(404).json({ message: "No volunteer profile found", registered: false });
  return res.json({ ...profile, registered: true });
}

// PUT /volunteers/me — upsert current user's volunteer profile
async function () {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Not authenticated" });

  const existing = await userId);
  if (existing) {
    await existing.id, req.body);
    const updated = await userId);
    return res.json({ message: "Profile updated", profile: updated });
  } else {
    const result = await { ...req.body, user_id: userId });
    return res.status(201).json({ message: "Profile created", id: result.lastInsertRowid });
  }
}

// PATCH /volunteers/:id/status — admin approves/rejects a volunteer
async function () {
  const { id } = req.params;
  const { status } = req.body;
  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status. Must be: pending, approved, or rejected" });
  }
  await Number(id), status);
  return res.json({ message: `Volunteer status updated to '${status}'` });
}

module.exports = {
  listVolunteers,
  broadcast,
  createVolunteer,
  getMyProfile,
  updateMyProfile,
  updateStatus,
};
