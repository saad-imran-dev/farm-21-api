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

  async getCommunityWithId(id) {
    const community = this.db.communities.findAll({
      where: {
        id: id,
      },
    });

    return community;
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

  async joinCommunity(userId, communityId) {
    await this.db.user_joined_communities.create({
      userId,
      communityId,
    });
  }

  async leaveCommunity(userId, communityId) {
    await this.db.user_joined_communities.destroy({
      where: {
        userId,
        communityId,
      },
    });
  }

  async isCommunityJoined(userId, communityId) {
    const communities = await this.db.user_joined_communities.findAll({
      where: {
        userId,
        communityId,
      },
    });

    if (communities.length > 0) {
      return true;
    }

    return false;
  }
}

const communityRepo = new CommunityRepo();

module.exports = communityRepo;
