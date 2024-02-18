const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const uploadAttachments = require("../middleware/uploadAttachments");
const { v4 } = require("uuid");
const storage = require("../utils/Storage");
const attachmentRepo = require("../data/attachment.repo");
const database = require("../data/Database");

const router = express.Router();

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

router.get("/", verifyToken, async (req, res) => {
  res.status(200).send("API working");
});

/**
 * @swagger
 * /api/test/storage:
 *   post:
 *     summary: Uploads test files to storage.
 *     tags: [Test]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       '200':
 *         description: Files uploaded successfully
 *       '500':
 *         description: Internal Server Error
 */
router.post(
  "/storage",
  verifyToken,
  uploadAttachments,
  async (req, res) => {
    const transaction = await database.getTransaction();

    try {
      for (const file of req.files) {
        const id = v4();
        const fileName = id + file.originalname;

        await storage.uploadFile(fileName, file.buffer);
        await attachmentRepo.createTestAttachment(id, fileName, transaction);
      }

      await transaction.commit();

      res.status(200).send("Files uploaded successfully");
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      res.status(500).send("Internal Server Error");
    }
  }
);

/**
 * @swagger
 * /api/test/storage:
 *   get:
 *     summary: Retrieves test attachments and their URLs.
 *     tags: [Test]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             example: { "attachments": ["url1", "url2"] }
 */
router.get("/storage", verifyToken, async (req, res) => {
  try {
    const url = process.env.STORAGE_PUBLIC_URL;
    const files = await attachmentRepo.getTestAttachment()
    let attachments = [];
    for (const file of files) {
      attachments.push(url + file.fileName);
    }

    res.status(200).send({ attachments });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

/**
 * @swagger
 * /api/test/storage:
 *   put:
 *     summary: Updates test attachments by deleting old ones and uploading new ones.
 *     tags: [Test]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       '200':
 *         description: Files uploaded successfully
 */
router.put(
  "/storage",
  verifyToken,
  uploadAttachments,
  async (req, res) => {
    const transaction = await database.getTransaction();

    try {
      const files = await attachmentRepo.getTestAttachment();

      // Delete old files
      await attachmentRepo.deleteTestAttachment(transaction);

      for (const file of files) {
        storage.deleteFile(file.fileName);
      }

      // Upload new files
      for (const file of req.files) {
        const id = v4();
        const fileName = Date.now() + "-" + file.originalname;

        await storage.uploadFile(fileName, file.buffer);
        await attachmentRepo.createTestAttachment(id, fileName, transaction);
      }

      await transaction.commit();

      res.status(200).send("Files uploaded successfully");
    } catch (error) {
      console.error(error);
      await transaction.rollback();
      res.status(500).send("Internal Server Error");
    }
  }
);

/**
 * @swagger
 * /api/test/storage:
 *   delete:
 *     summary: Deletes all test attachments.
 *     tags: [Test]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Files deleted
 */
router.delete("/storage", verifyToken, async (req, res) => {
  try {
    const files = await attachmentRepo.getTestAttachment();

    await attachmentRepo.deleteTestAttachment();

    for (const file of files) {
      storage.deleteFile(file.fileName);
    }

    res.status(200).send("Files deleted");
  } catch (error) {
    res.status(500).send("Internal Server Error");
    console.error(error);
  }
});

module.exports = router;

module.exports = router;
