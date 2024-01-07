const express = require("express");

const router = express.Router()

router.get("/test/", async (req, res) => {
    res.status(200).send("API working.")
})

module.exports = router
