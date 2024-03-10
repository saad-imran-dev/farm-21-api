const express = require("express")
const verifyToken = require("../middleware/verifyToken");
const feedController = require("../controllers/feed.controller");

const router = express.Router()

router.use(verifyToken);

router.get("/", feedController.get)

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Feed
 *   description: 
 */

/**
 * @swagger
 * /api/feed:
 *   get:
 *     summary: Get user Feed
 *     tags: [Feed]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns an array of post id
 *       500:
 *         description: Internal Server Error
 */