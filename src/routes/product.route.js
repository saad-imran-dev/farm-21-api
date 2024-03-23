const express = require("express");
const productController = require("../controllers/product.controller");
const verifyToken = require("../middleware/verifyToken");
const uploadAttachments = require("../middleware/uploadAttachments");

const router = express.Router()

router.use(verifyToken)

router.get("/", productController.get);

router.get("/:id", productController.getOne);

router.post("/", uploadAttachments, productController.create);

router.patch("/:id", uploadAttachments, productController.update);

router.delete("/:id", productController.delete);

module.exports = router