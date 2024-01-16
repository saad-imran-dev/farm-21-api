const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router()

router.post("/user/signup", userController.signup)

router.post("/user/signin", userController.signin)

router.post("/user/verify", userController.verify)

module.exports = router
