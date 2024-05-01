const { Sequelize, QueryTypes } = require("sequelize");
const database = require("./Database");
const sequelize = require("../config/sequelize");

class UserRepo {
  constructor() {
    this.db = database.getDatabase();
  }

  async get(id) {
    const user = await this.db.users.findOne({
      where: {
        id,
      },
      attributes: ["id", "name", "email", "desc", "isExpert", "coins", "createdAt"]
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

  async updateDesc(desc, id) {
    const userUpdated = this.db.users.update({ desc }, { where: { id } })
    return userUpdated
  }

  async getProfile(id) {
    const profile = await this.db.attachments.findOne({
      where: {
        userId: id
      }
    })

    return profile
  }

  async addProfile(fileName, userId) {
    await this.db.attachments.create({
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

  async getRank(userId) {
    const userRankQuery = `select sub."rank" from (
      select
        row_number() over() as rank,
        "userId",
        sum(
          case
            when vote = true then 1
            else 0
          end
        ) - sum(
          case
            when vote = false then 1
            else 0
          end
        ) as votes
      from
        comment_votes_by_user
      group by
        "userId"
      order by
        "votes" desc
    )as sub where sub."userId" = '${userId}'`

    const rank = await sequelize.query(userRankQuery, { type: QueryTypes.SELECT })

    return rank[0]
  }
}

const userRepo = new UserRepo();

module.exports = userRepo;
