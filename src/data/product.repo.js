const database = require("./Database")
const NotFoundError = require("../Exceptions/NotFoundError")

class ProductRepo {
    constructor() {
        this.db = database.getDatabase()
    }

    async find() {
        const products = await this.db.products.findAll({
            order: [["createdAt"]],
            include: {
                association: "user_products",
                attributes: ["name", "email"]
            },
            attributes: ["id", "name", "desc", "price", "createdAt"]
        })

        return products
    }

    async findOne(id) {
        const product = await this.db.products.findOne({
            where: { id },
        })

        if (!product) throw new NotFoundError()

        return product
    }

    async create(name, desc, price, userId) {
        const product = await this.db.products.create({
            name,
            desc,
            price,
            userId
        })

        return product
    }

    async update(id, name, desc, price) {
        const product = await this.db.products.update({
            name,
            desc,
            price,
        }, {
            where: { id }
        })

        return product
    }

    async delete(id) {
        return await this.db.products.destroy({
            where: {
                id
            }
        })
    }
}

const productRepo = new ProductRepo()

module.exports = productRepo