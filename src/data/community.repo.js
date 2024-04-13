const database = require("./Database");

class CommunityRepo {
  constructor() {
    this.db = database.getDatabase();
  }

  async createCommunity(name, desc, userId) {
    const community = await this.db.communities.create({
      name: name,
      desc: desc,
      userId: userId,
    });

    return community;
  }

  async getPosts(id) {
    const community = await this.db.communities.findOne({
      where: {
        id: id
      },
      include: [
        {
          association: "community_moderator",
          attributes: ["name", "email"]
        },
        {
          association: "community_posts",
          attributes: ["id"]
        }
      ],
      attributes: ["id", "name", "desc", "createdAt"]
    });

    return community;
  }

  async getCommunity() {
    const communities = await this.db.communities.findAll({
      include: {
        association: "community_moderator",
        attributes: ["name", "email"]
      },
      attributes: ["id", "name", "desc", "createdAt"]
    });

    return communities;
  }

  async getCommunityWithName(name) {
    const communities = await this.db.communities.findAll({
      where: {
        name: name,
      },
    });

    return communities;
  }

  async getCommunityWithId(id) {
    const community = await this.db.communities.findOne({
      where: {
        id: id
      },
      include: {
        association: "community_moderator",
        attributes: ["name", "email"]
      },
      attributes: ["id", "name", "desc", "createdAt"]
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

  async isCommunityMod(id, userId) {
    const community = await this.db.communities.findOne({
      where: {
        id: id,
      },
      include: {
        association: "community_moderator",
      }
    });

    if (community?.community_moderator?.id === userId) {
      return true
    } else {
      return false
    }
  }

  async addProfile(id, fileName, communityId) {
    await this.db.attachments.create({
      id,
      fileName,
      communityId
    })
  }

  async getProfile(communityId) {
    const attachment = this.db.attachments.findOne({
      where: {
        communityId
      }
    })

    return attachment
  }

  async deleteProfile(communityId) {
    await this.db.attachments.destroy({
      where: {
        communityId: communityId
      }
    })
  }
}

const communityRepo = new CommunityRepo();

module.exports = communityRepo;
