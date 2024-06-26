const express = require("express");
const userController = require("../controllers/user.controller");
const verifyToken = require("../middleware/verifyToken");
const uploadProfile = require("../middleware/uploadProfile")

const router = express.Router();

router.post("/signup", userController.signup);

router.post("/signin", userController.signin);

// router.post("/signin/oauth", userController.googleSignin);

router.post("/verify", userController.verify);

router.use(verifyToken)

router.post("/profile", uploadProfile, userController.createUserProfile)

router.get("/", userController.getUser)

router.get("/community", userController.getUserCommunities);

router.get("/:id", userController.getUserById)

module.exports = router;

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

/**
 * @swagger
 * /api/user/:
 *   get:
 *     summary: Get user details 
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved communities
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user details by id
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved communities
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/user/profile/:
 *   post:
 *     summary: Update user profile of user. Form data fieldname should be "Profile" for setting profile pic
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: Profile
 *         schema:
 *           type: file
 *         description: The profile pic to upload.
 *     requestBody:
 *       description: User verification data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               desc:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully updated profile
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/user/community/:
 *   get:
 *     summary: Get a list of communities joined by user 
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved communities
 *       '500':
 *         description: Internal Server Error
 */