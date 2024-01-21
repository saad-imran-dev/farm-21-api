const express = require("express");
const verifyToken = require("../middleware/verifyToken")

const router = express.Router()

/**
 * @swagger
 * /api/test:
 *   get:
 *     summary: Test Endpoint
 *     description: Returns a message to confirm that the API is working.
 *     tags:
 *       - Test
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           text/plain:
 *             example: 'API working.'
 */

router.get("/test/", verifyToken, async (req, res) => {
    res.status(200).send("API working.")
})

router.post("/test/storage", verifyToken, async (req, res) => {
    res.status(200).send("File saved")
})

module.exports = router
