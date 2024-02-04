const multer = require("multer");

const upload = multer({ preservePath: false });
const uploadProfile = upload.single("Profile");

module.exports = uploadProfile;
