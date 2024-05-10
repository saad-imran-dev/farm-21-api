const validationHandler = require("../validation/validationHandler");
const commentValidation = require("../validation/comment.validation");
const commentRepo = require("../data/comment.repo");
const postRepo = require("../data/post.repo");
const NotFoundError = require("../Exceptions/NotFoundError");
const UnAuthorizedError = require("../Exceptions/unauthorizedError");
const userRepo = require("../data/user.repo");
const storage = require("../utils/Storage");
const Ranking = require("../utils/Ranking");

userProfilePic = async (userId) => {
    const profile = await userRepo.getProfile(userId)
    const url = await storage.getUrl(profile?.filename)
    console.log(url, "profile")

    if (url && url.publicUrl.split('/').slice(-1)[0] === "undefined") {
        return undefined;
    }

    return url?.publicUrl
}

class CommentController {
    constructor() {
        this.ranking = new Ranking()
    }

    get = async (req, res) => {
        console.log("--> GET user comments")

        const comments = await commentRepo.getForUser(req.uid)
        const profile = await this.userProfilePic(req.uid)

        const commentWithVotes = await Promise.all(comments.map(async (comment) => {
            const votes = await commentRepo.getVotes(comment.dataValues.id)
            const voteGiven = await commentRepo.checkVote(comment.dataValues.id, req.uid)

            return {
                ...comment.dataValues,
                votes,
                voteGiven,
                profile
            }
        }))

        res.send({ comments: commentWithVotes })
    }

    getForPost = async (req, res) => {
        console.log("--> GET comments for post")

        const { postId } = req.params

        if (!(await postRepo.getPost(postId)))
            throw new NotFoundError()

        const comments = await commentRepo.get(postId)

        const commentWithVotes = await Promise.all(comments.map(async (comment) => {
            const votes = await commentRepo.getVotes(comment.dataValues.id)
            const voteGiven = await commentRepo.checkVote(comment.dataValues.id, req.uid)
            const profile = await userRepo.getProfile(comment.dataValues.user_comments.id)
            let url = undefined;

            if (profile) {
                url = process.env.STORAGE_PUBLIC_URL + profile.fileName
            }

            return {
                ...comment.dataValues,
                votes,
                voteGiven,
                profile: url,
            }
        }))

        const rankedComments = await this.ranking.comments(commentWithVotes)

        res.send({ comments: rankedComments })
    }

    getReply = async (req, res) => {
        console.log("--> GET replies for comments")

        const { commentId } = req.params

        if (!(await commentRepo.getById(commentId)))
            throw new NotFoundError()

        const replies = await commentRepo.getReply(commentId)

        const replyWithVotes = await Promise.all(replies.map(async (reply) => {
            const votes = await commentRepo.getVotes(reply.dataValues.id)
            const voteGiven = await commentRepo.checkVote(reply.dataValues.id, req.uid)
            const profile = await userRepo.getProfile(reply.dataValues.user_comments.id)
            let url = undefined;

            if (profile) {
                url = process.env.STORAGE_PUBLIC_URL + profile.fileName
            }

            return {
                ...reply.dataValues,
                votes,
                voteGiven,
                profile: url,
            }
        }))

        res.send({ replies: replyWithVotes })
    }

    create = async (req, res) => {
        console.log("--> Create Comment on post");

        const { postId } = req.params;
        const { comment } = req.body;
        await validationHandler(req.body, commentValidation.create);

        if (!(await postRepo.getPost(postId)))
            throw new NotFoundError()

        const commentCreated = await commentRepo.create(comment, postId, req.uid);

        res.send({ comment: commentCreated, });
    }

    createReply = async (req, res) => {
        console.log("--> Create Comment on post");

        const { commentId } = req.params;
        const { reply } = req.body;
        await validationHandler(req.body, commentValidation.createReply);

        if (!(await commentRepo.getById(commentId)))
            throw new NotFoundError()

        const replyCreated = await commentRepo.createReply(reply, commentId, req.uid);

        res.send({ reply: replyCreated, });
    }

    delete = async (req, res) => {
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

    vote = async (req, res) => {
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