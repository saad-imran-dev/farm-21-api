const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const communityController = require("../controllers/community.controller");
const uploadProfile = require("../middleware/uploadProfile");

const router = express.Router()

router.use(verifyToken)

router.post("/", uploadProfile, communityController.createCommunity);

router.get("/", communityController.getCommunities);

router.get("/:id", communityController.getCommunity);

router.get("/post/:id", communityController.getCommunityPost);

router.patch("/:id", communityController.updateCommunity);

router.delete("/:id", communityController.deleteCommunity);

router.post("/profile/:id", uploadProfile, communityController.communityProfile)

router.post("/join/:id", communityController.joinCommunity);

router.post("/leave/:id", communityController.leaveCommunity);

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Community
 *   description: Operations related to community management
 */

/**
 * @swagger
 * /api/community/:
 *   post:
 *     summary: Create a new community
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Community data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                  type: string
 *               desc:
 *                  type: string
 *             required:
 *               - name
 *               - desc
 *     responses:
 *       '200':
 *         description: Community created successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/community/:
 *   get:
 *     summary: Get a list of communities
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved communities
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/community/{id}:
 *   get:
 *     summary: Get community details
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved communities
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/community/post/{id}:
 *   get:
 *     summary: Get community details & all posts
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved communities
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/community/{id}:
 *   patch:
 *     summary: Update a community by ID
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the community to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated community data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               desc:
 *                  type: string
 *             required:
 *               - desc
 *     responses:
 *       '200':
 *         description: Community updated successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/community/{id}:
 *   delete:
 *     summary: Delete a community by ID
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the community to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Community deleted successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/community/profile/{id}:
 *   post:
 *     summary: Add a profile pic to community. Form data fieldname should be "Profile"
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the community to delete
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Community profile pic updated successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/community/join/{id}:
 *   post:
 *     summary: Join a Community
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the community to delete
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Community data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: Joinned Community successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/community/leave/{id}:
 *   post:
 *     summary: leave Community
 *     tags: [Community]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the community to delete
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Community data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       '200':
 *         description: left Community successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */
