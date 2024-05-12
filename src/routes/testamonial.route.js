const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const testamonialController = require("../controllers/testamonial.controller");

const router = express.Router()

router.use(verifyToken)

router.get("/", testamonialController.getUser);

router.get("/:id", testamonialController.get);

router.post("/:id", testamonialController.create);

module.exports = router

/**
 * @swagger
 * tags:
 *   name: Testamonial
 *   description: Operations related to Testamonial
 */

/**
 * @swagger
 * /api/testamonial:
 *   post:
 *     summary: Create a new testamonials
 *     tags: [Testamonial]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Testamonial ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               testamonial:
 *                  type: string
 *             required:
 *               - testamonial
 *     responses:
 *       '200':
 *         description: Successfully created product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */

/**
/**
 * @swagger
 * /api/testamonial:
 *   get:
 *     summary: GET My testamonials
 *     tags: [Testamonial]
 *     responses:
 *       '200':
 *         description: Successfully received product
 *       '400':
 *         description: Bad Request
 */

/**
 * @swagger
 * /api/testamonial/{id}:
 *   get:
 *     summary: GET Testamonials of a user with id
 *     tags: [Testamonial]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       '200':
 *         description: Successfully received product
 *       '400':
 *         description: Bad Request
 */
