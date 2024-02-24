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

        res.send({ comments })
    }

    async getReply(req, res) {
        console.log("--> GET replies for comments")

        const { commentId } = req.params

        if (!(await commentRepo.getById(commentId)))
            throw new NotFoundError()

        const replies = await commentRepo.getReply(commentId)

        res.send({ replies })
    }

    async create(req, res) {
        console.log("--> Create Comment on post");

        const { postId } = req.params;
        const { comment } = req.body;
        await validationHandler(req.body, commentValidation.createComment);

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
        if(comment.dataValues.userId !== req.uid)
            throw new UnAuthorizedError()

        const deleted = await commentRepo.delete(id)

        res.send({ deleted })
    }
}

const commentController = new CommentController()

module.exports = commentController;