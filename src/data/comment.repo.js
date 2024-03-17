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

    async getForUser(userId){
        const comments = await this.db.comments.findAll({
            where: {
                userId
            },
            order: [
                ["createdAt"]
            ]
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

    async vote(vote, commentId, userId) {
        const commentVote = await this.db.comment_votes_by_user.create({
            commentId,
            userId,
            vote
        })

        return commentVote
    }

    async getVotes(commentId) {
        const votePositive = await this.db.comment_votes_by_user.count({
            where: {
                commentId,
                vote: true,
            }
        })

        const voteNegative = await this.db.comment_votes_by_user.count({
            where: {
                commentId,
                vote: false,
            }
        })

        return votePositive - voteNegative
    }

    async checkVote(commentId, userId) {
        const vote = await this.db.comment_votes_by_user.findOne({
            where: {
                commentId,
                userId
            }
        })

        return vote?.dataValues?.vote
    }
}

const commentRepo = new CommentRepo()

module.exports = commentRepo