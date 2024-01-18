const database = require("./Database");

class CommunityRepo {
  constructor() {
    this.db = database.getDatabase();
  }

  async createCommunity(name, desc) {
    const community = await this.db.communities.create({
      name: name,
      desc: desc,
    });

    return community;
  }

  async getCommunity() {
    const communities = this.db.communities.findAll();
    return communities;
  }

  async getCommunityWithName(name) {
    const communities = this.db.communities.findAll({
      where: {
        name: name,
      },
    });

    return communities;
  }

  async updateCommunity(id, desc) {
    const community = await this.db.communities.update(
      {
        desc: desc,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return community;
  }

  async deleteCommunity(id) {
    await this.db.communities.destroy({
      where: {
        id: id,
      },
    });
  }
}

const communityRepo = new CommunityRepo();

module.exports = communityRepo;
