const express = require("express");
const verifyToken = require("../middleware/verifyToken")

const router = express.Router()

router.get("/test/", verifyToken, async (req, res) => {
    res.status(200).send("API working.")
})

module.exports = router
