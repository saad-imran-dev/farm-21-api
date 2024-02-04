const database = require("./Database");

class UserRepo {
  constructor() {
    this.db = database.getDatabase();
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
}

const userRepo = new UserRepo();

module.exports = userRepo;
