const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User operations
 */

/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       description: User signup data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: User signed up successfully
 *       '400':
 *         description: Invalid inputs or user already exists
 *       '500':
 *         description: Internal Server Error
 */
router.post("/user/signup", userController.signup);

/**
 * @swagger
 * /api/user/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [User]
 *     requestBody:
 *       description: User signin data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: User signed in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       '400':
 *         description: Invalid inputs or authentication error
 *       '500':
 *         description: Internal Server Error
 */
router.post("/user/signin", userController.signin);

/**
 * @swagger
 * /api/user/verify:
 *   post:
 *     summary: Verify a user after signup with email OTP code
 *     tags: [User]
 *     requestBody:
 *       description: User verification data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               token:
 *                 type: string
 *               name:
 *                 type: string
 *             required:
 *               - email
 *               - token
 *               - name
 *     responses:
 *       '200':
 *         description: User verified successfully
 *       '400':
 *         description: Invalid inputs, token, or authentication error
 *       '500':
 *         description: Internal Server Error
 */
router.post("/user/verify", userController.verify);


module.exports = router
