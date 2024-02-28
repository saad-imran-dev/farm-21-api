const database = require("./Database");

class UserRepo {
  constructor() {
    this.db = database.getDatabase();
  }

  async get(id) {
    const user = await this.db.users.findOne({
      where: {
        id,
      }
    })

    return user
  }

  async getUserWithEmail(email) {
    const user = await this.db.users.findAll({
      where: {
        email: email,
      },
    });

    return user[0];
  }

  async createUser(id, name, email) {
    const user = await this.db.users.create({
      id: id,
      name: name,
      email: email,
    });

    return user;
  }

  async getUserCommunities(id) {
    const user = await this.db.users.findAll({
      where: {
        id: id,
      },
      include: {
        association: "joined_communites",
        attributes: ["id", "name"],
      },
    });

    return user[0].joined_communites;
  }

  async getProfile(id) {
    const profile = await this.db.attachments.findOne({
      where: {
        userId: id
      }
    })

    return profile
  }

  async addProfile(id, fileName, userId) {
    await this.db.attachments.create({
      id,
      fileName,
      userId
    })
  }

  async deleteProfile(userId) {
    await this.db.attachments.destroy({
      where: {
        userId: userId
      }
    })
  }
}

const userRepo = new UserRepo();

module.exports = userRepo;
