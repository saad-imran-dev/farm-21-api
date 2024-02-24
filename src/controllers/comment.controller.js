const validationHandler = require("../validation/validationHandler");
const commentValidation = require("../validation/comment.validation");
const commentRepo = require("../data/comment.repo");
const postRepo = require("../data/post.repo");
const NotFoundError = require("../Exceptions/NotFoundError");
const UnAuthorizedError = require("../Exceptions/unauthorizedError");

class CommentController {
    async get(req, res) {
        console.log("--> GET comments for post")

        const { postId } = req.params

        if (!(await postRepo.getPost(postId)))
            throw new NotFoundError()

        const comments = await commentRepo.get(postId)

        const commentWithVotes = await Promise.all(comments.map(async (comment) => {
            const votes = await commentRepo.getVotes(comment.dataValues.id)
            const voteGiven = await commentRepo.checkVote(comment.dataValues.id, req.uid)

            return {
                ...comment.dataValues,
                votes,
                voteGiven,
            }
        }))

        res.send({ comments: commentWithVotes })
    }

    async getReply(req, res) {
        console.log("--> GET replies for comments")

        const { commentId } = req.params

        if (!(await commentRepo.getById(commentId)))
            throw new NotFoundError()

        const replies = await commentRepo.getReply(commentId)

        const replyWithVotes = await Promise.all(replies.map(async (reply) => {
            const votes = await commentRepo.getVotes(reply.dataValues.id)
            const voteGiven = await commentRepo.checkVote(reply.dataValues.id, req.uid)

            return {
                ...reply.dataValues,
                votes,
                voteGiven,
            }
        }))

        res.send({ replies: replyWithVotes })
    }

    async create(req, res) {
        console.log("--> Create Comment on post");

        const { postId } = req.params;
        const { comment } = req.body;
        await validationHandler(req.body, commentValidation.create);

        if (!(await postRepo.getPost(postId)))
            throw new NotFoundError()

        const commentCreated = await commentRepo.create(comment, postId, req.uid);

        res.send({ comment: commentCreated, });
    }

    async createReply(req, res) {
        console.log("--> Create Comment on post");

        const { commentId } = req.params;
        const { reply } = req.body;
        await validationHandler(req.body, commentValidation.createReply);

        if (!(await commentRepo.getById(commentId)))
            throw new NotFoundError()

        const replyCreated = await commentRepo.createReply(reply, commentId, req.uid);

        res.send({ reply: replyCreated, });
    }

    async delete(req, res) {
        console.log("--> DELETE comment")

        const { id } = req.params

        const comment = await commentRepo.getById(id)

        if (!comment)
            throw new NotFoundError()
        if (comment.dataValues.userId !== req.uid)
            throw new UnAuthorizedError()

        const deleted = await commentRepo.delete(id)

        res.send({ deleted })
    }

    async vote(req, res) {
        console.log("--> Vote for a comment")

        const { commentId } = req.params
        const { vote } = req.body
        await validationHandler(req.body, commentValidation.vote)

        if (!(await commentRepo.getById(commentId)))
            throw new NotFoundError()

        await commentRepo.vote(vote, commentId, req.uid)

        res.send({ message: "Voted for comment" })
    }
}

const commentController = new CommentController()

module.exports = commentController;