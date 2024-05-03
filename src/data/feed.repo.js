const database = require("./database");

class FeedRepo {
    constructor() {
        this.db = database.getDatabase();
    }

    async get(userId) {
        const userCommunityPosts = await this.db.users.findOne({
            where: {
                id: userId,
            },
            include: {
                association: "joined_communites",
                include: {
                    association: "community_posts",
                    attributes: ["id", "createdAt"],
                },
                attributes: ["id"],
            },
            attributes: ["id"],
            order: [
                [
                    { model: this.db.communities, as: 'joined_communites' },
                    { model: this.db.posts, as: 'community_posts' },
                    "createdAt",
                    "DESC"
                ]
            ]
        })

        return userCommunityPosts
    }
}

const feedRepo = new FeedRepo()

module.exports = feedRepo