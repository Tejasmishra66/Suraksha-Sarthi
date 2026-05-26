const intelModel = require("../models/intelModel");

function listIntelPins() {
  return intelModel.listIntelPins();
}

function createIntelPin(payload) {
  const { lat, lon, department, note } = payload;
  if (lat == null || lon == null || !department || !note) {
    const error = new Error("lat, lon, department, and note are required");
    error.statusCode = 400;
    throw error;
  }

  const result = intelModel.createIntelPin({
    lat: Number(lat),
    lon: Number(lon),
    department,
    note
  });

  return { id: result.lastInsertRowid, lat: Number(lat), lon: Number(lon), department, note };
}

module.exports = {
  listIntelPins,
  createIntelPin
};