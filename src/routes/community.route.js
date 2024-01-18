const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const communityController = require("../controllers/community.controller");

const router = express.Router()

router.post("/community/", verifyToken, communityController.createCommunity)

router.get("/community/", verifyToken, communityController.getCommunities)

router.patch("/community/:id", verifyToken, communityController.updateCommunity)

router.delete("/community/:id", verifyToken, communityController.deleteCommunity)

module.exports = router
