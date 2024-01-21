const supabase = require("../config/supabase");

class Storage {
    constructor() {
        if (!Storage.instance) {
            this.storage = supabase.storage;
            this.bucket = process.env.STORAGE_BUCKET
            Storage.instance = this;
        }

        return Storage.instance;
    }

    async createTestFile(fileId, fileName, file) {
        // Implemention
    }

    async deleteTestFile(fileName) {
        // Implementation
    }
}

const storage = new Storage();

module.exports = storage;
