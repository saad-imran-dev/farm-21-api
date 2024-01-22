const supabase = require("../config/supabase");

class Storage {
  constructor() {
    if (!Storage.instance) {
      this.storage = supabase.storage;
      this.bucket = process.env.STORAGE_BUCKET;
      Storage.instance = this;
    }

    return Storage.instance;
  }

  async uploadFile(fileName, file) {
    const { data, error } = await this.storage
      .from(process.env.STORAGE_BUCKET)
      .upload(fileName, file, { upsert: true });

    if (error) {
      throw error;
    }

    return data;
  }

  async deleteFile(fileName) {
    const { data, error } = await this.storage
      .from(process.env.STORAGE_BUCKET)
      .remove(fileName);

    if (error) {
      throw error;
    }
  }
}

const storage = new Storage();

module.exports = storage;
