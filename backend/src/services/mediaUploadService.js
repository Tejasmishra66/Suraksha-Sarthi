const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, path.resolve(__dirname, "../uploads")),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  }
});

const uploadSinglePhoto = multer({ storage }).single("photo");

module.exports = {
  uploadSinglePhoto
};
