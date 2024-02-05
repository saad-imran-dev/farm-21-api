const express = require("express");
const postController = require("../controllers/post.controller");
const verifyToken = require("../middleware/verifyToken");
const uploadAttachments = require("../middleware/uploadAttachments");

const router = express.Router()

router.get("/post/", verifyToken, postController.getPosts);

router.get("/post/:id", verifyToken, postController.getPost);

router.post("/post/", verifyToken, uploadAttachments, postController.createPost);

router.delete("/post/:id", verifyToken, postController.deletePost);

router.post("/post/like/:id", verifyToken, postController.likePost);

router.post("/post/dislike/:id", verifyToken, postController.dislikePost);

module.exports = router

