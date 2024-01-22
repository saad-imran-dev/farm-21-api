const database = require("./Database");

class AttachmentRepo {
  constructor() {
    this.db = database.getDatabase();
  }

  async createTestAttachment(id, fileName, transaction) {
    const attachment = await this.db.attachments.create(
      {
        id,
        fileName,
      },
      { transaction }
    );

    return attachment;
  }

  async getTestAttachment() {
    const attachments = await this.db.attachments.findAll({
      where: {
        postId: null,
        productId: null,
        userId: null,
        communityId: null,
      },
      attributes: ["fileName"],
    });

    return attachments;
  }

  async deleteTestAttachment(transaction) {
    await this.db.attachments.destroy(
      {
        where: {
          postId: null,
          productId: null,
          userId: null,
          communityId: null,
        },
      },
      transaction ? { transaction } : {}
    );
  }
}

const attachmentRepo = new AttachmentRepo();

module.exports = attachmentRepo;
