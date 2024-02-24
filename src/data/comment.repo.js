const database = require("./Database");

class CommentRepo {
    constructor() {
        this.db = database.getDatabase();
    }

    async get(postId) {
        const comments = await this.db.comments.findAll({
            where: {
                postId,
                commentId: null,
            },
            include: {
                association: "user_comments",
                attributes: ["name", "email"]
            },
            attributes: ["id", "comment", "createdAt"]
        })

        return comments
    }

    async getById(id) {
        const comment = await this.db.comments.findOne({
            where: {
                id
            },
        })

        return comment
    }

    async getReply(commentId) {
        const replies = await this.db.comments.findAll({
            where: {
                commentId,
            },
            include: {
                association: "user_comments",
                attributes: ["name", "email"]
            },
            attributes: ["id", "comment", "createdAt"]
        })

        return replies
    }

    async create(comment, postId, userId) {
        const commentCreated = await this.db.comments.create({
            comment, postId, userId
        })

        return commentCreated
    }

    async createReply(reply, commentId, userId) {
        const comment = await this.getById(commentId)
        const replyCreated = await this.db.comments.create({
            comment: reply,
            commentId,
            userId,
            postId: comment.dataValues.postId,
        })

        return replyCreated
    }

    async delete(id) {
        const comment = await this.db.comments.destroy({
            where: {
                id
            }
        })

        return comment
    }
}

const commentRepo = new CommentRepo()

module.exports = commentRepo