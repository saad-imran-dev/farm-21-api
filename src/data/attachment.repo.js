const database = require("./Database");

class AttachmentRepo {
    constructor() {
        this.db = database.getDatabase();
    }

    async getTestAttachment() {
        // Implementation
    }

    async createTestAttachment(files) {
        // Implementation
    }
}

const attachmentRepo = new AttachmentRepo();

module.exports = attachmentRepo;
