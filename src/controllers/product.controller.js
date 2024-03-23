const productRepo = require("../data/product.repo")
const productValidation = require("../validation/product.validation")
const validationHandler = require("../validation/validationHandler")

class ProductController {
    async get(req, res) {
        const products = await productRepo.find()
        res.json(products)
    }

    // async getOne(req, res) {
    //     const { id } = req.params
    //     const product = await productRepo.findOne(id)
    //     res.json(product)
    // }

    async create(req, res) {
        await validationHandler(req.body, productValidation.create) // Validation checks for request Body
        const { name, desc, price } = req.body
        const product = await productRepo.create(name, desc, price, req.uid)
        res.json(product)
    }

    async update(req, res) {
        await validationHandler(req.body, productValidation.update) // Validation checks for request Body
        const { id } = req.params
        const { name, desc, price } = req.body
        const product = await productRepo.update(id, name, desc, price)
        res.json(product)
    }

    async delete(req, res) {
        const { id } = req.params
        const status = await productRepo.delete(id)
        res.sendStatus(200)
    }
}

const productController = new ProductController()

module.exports = productController