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

module.exports = router;