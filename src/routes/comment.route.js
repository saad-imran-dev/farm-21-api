const express = require("express")
const verifyToken = require("../middleware/verifyToken");
const commentController = require("../controllers/comment.controller");

const router = express.Router()

router.use(verifyToken);

router.get("/:postId", commentController.get)

router.post("/:postId", commentController.create)

router.delete("/:id", commentController.delete)

router.get("/reply/:commentId", commentController.getReply)

router.post("/reply/:commentId", commentController.createReply)

router.post("/vote/:commentId", commentController.vote)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: Operations related to Post comments
 */

/**
 * @swagger
 * /api/comments/{postId}:
 *   get:
 *     summary: Get comments for a post
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post to get comments for
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with comments and votes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   description: List of comments with votes
 *       '404':
 *         description: Post not found
 */

/**
 * @swagger
 * /api/comments/{postId}:
 *   post:
 *     summary: Create a new comment on a post
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: ID of the post to create a comment on
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Comment data to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful response with the created comment
 *       '404':
 *         description: Post not found
 */

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the comment to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with deletion status
 *       '404':
 *         description: Comment not found
 *       '401':
 *         description: Unauthorized access
 */

/**
 * @swagger
 * /api/comments/reply/{commentId}:
 *   get:
 *     summary: Get replies for a comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID of the comment to get replies for
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with replies and votes
 *       '404':
 *         description: Comment not found
 */

/**
 * @swagger
 * /api/comments/reply/{commentId}:
 *   post:
 *     summary: Create a reply for a comment
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID of the comment to create a reply for
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Reply data to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reply:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful response with the created reply
 *       '404':
 *         description: Comment not found
 */

/**
 * @swagger
 * /api/comments/vote/{commentId}:
 *   post:
 *     summary: Vote for a comment. Positive vote if true, negative if false.
 *     tags: [Comment]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: ID of the comment to vote for
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Vote data for the comment
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vote:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Successful response with a message
 *       '404':
 *         description: Comment not found
 */
