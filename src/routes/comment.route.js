const express = require("express")
const verifyToken = require("../middleware/verifyToken");
const commentController = require("../controllers/comment.controller");

const router = express.Router()

router.use(verifyToken);

router.get("/", commentController.get)

router.post("/", commentController.create)

router.delete("/:id", commentController.delete)

router.get("/reply/:id", commentController.getReply)

router.post("/reply/:id", commentController.createReply)

router.delete("/reply/:id", commentController.deleteReply)

module.exports = router;