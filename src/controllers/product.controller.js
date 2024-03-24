const productRepo = require("../data/product.repo")
const productService = require("../services/product.services")
const productValidation = require("../validation/product.validation")
const validationHandler = require("../validation/validationHandler")

class ProductController {
    constructor() {
        this.service = productService
    }

    get = async (req, res) => {
        const { search, page, pageSize } = req.query
        const products = await this.service.get(search, parseInt(page), parseInt(pageSize))
        res.json(products)
    }

    create = async (req, res) => {
        await validationHandler(req.body, productValidation.create) // Validation checks for request Body
        const { name, desc, price } = req.body
        const product = await this.service.create(name, desc, price, req.uid)
        res.json(product)
    }

    update = async (req, res) => {
        await validationHandler(req.body, productValidation.update) // Validation checks for request Body
        const { id } = req.params
        const { name, desc, price } = req.body
        const status = await this.service.update(id, name, desc, price)
        res.json(status)
    }

    delete = async (req, res) => {
        const { id } = req.params
        const status = await this.service.delete(id)
        res.json(status)
    }
}

const productController = new ProductController()

module.exports = productController