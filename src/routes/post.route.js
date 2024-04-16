const express = require("express");
const postController = require("../controllers/post.controller");
const verifyToken = require("../middleware/verifyToken");
const uploadAttachments = require("../middleware/uploadAttachments");

const router = express.Router()

router.use(verifyToken)

router.get("/", postController.getPosts);

router.get("/:id", postController.getPost);

router.get("/user/:id", postController.getUserPost);

router.post("/", uploadAttachments, postController.createPost);

router.delete("/:id", postController.deletePost);

router.post("/like/:id", postController.likePost);

router.post("/dislike/:id", postController.dislikePost);

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API endpoints for managing posts
 */

/**
 * @swagger
 * /api/post:
 *   get:
 *     summary: Get user posts
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns an array of user posts
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/post/{id}:
 *   get:
 *     summary: Get a specific post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to retrieve
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the details of the specified post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/post/user/{id}:
 *   get:
 *     summary: Get other user posts
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the user
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns an array of user posts
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/post:
 *   post:
 *     summary: Create a new post. To add images, attach images files with feild name 'Attachments'
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               communityId:
 *                 type: string
 *               Attachments:
 *                 type: file
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Invalid inputs
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/post/{id}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/post/like/{id}:
 *   post:
 *     summary: Like a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to like
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Post liked successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/post/dislike/{id}:
 *   post:
 *     summary: Dislike a post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to dislike
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Post disliked successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal Server Error
 */
