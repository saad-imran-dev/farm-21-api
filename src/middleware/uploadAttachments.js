const multer = require("multer");

const upload = multer({ preservePath: false });
const uploadAttachments = upload.array("Attachments", 20);

module.exports = uploadAttachments
