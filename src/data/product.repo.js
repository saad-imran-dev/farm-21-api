const database = require("./database")
const NotFoundError = require("../Exceptions/NotFoundError")
const { Op } = require("sequelize")

class ProductRepo {
    constructor() {
        this.db = database.getDatabase()
    }

    async find(search, limit, offset) {
        const products = await this.db.products.findAll({
            where: {
                name: {
                    [Op.like]: `%${search.toLowerCase()}%`
                }
            },
            order: [["createdAt"]],
            include: [
                {
                    association: "user_products",
                    attributes: ["id", "name", "email"]
                },
                {
                    association: "product_attachments",
                    attributes: ["fileName"]
                },
            ],
            attributes: ["id", "name", "desc", "price", "phone", "createdAt"],
            limit,
            offset,
        })

        const count = await this.db.products.count({
            where: {
                name: {
                    [Op.like]: `%${search}%`
                }
            },
        })

        return { products, pages: limit ? Math.ceil(count / limit) : 1, }
    }

    async findOne(id) {
        const product = await this.db.products.findOne({
            where: { id },
        })

        if (!product) throw new NotFoundError()

        return product
    }

    async create(name, desc, price, phone, userId) {
        const product = await this.db.products.create({
            name: name.toLowerCase(),
            desc: desc.toLowerCase(),
            price,
            phone,
            userId,
        })

        return product
    }

    async update(id, name, desc, price, phone) {
        const product = await this.db.products.update({
            name,
            desc,
            price,
            phone,
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

    async getAttachment(productId) {
        return this.db.attachments.findAll({
            where: {
                productId
            }
        })
    }

    async addAttachment(fileName, productId) {
        return this.db.attachments.create({
            fileName,
            productId
        })
    }

    async deleteAttachment(productId) {
        return this.db.attachments.destroy({
            where: {
                productId
            }
        })
    }
}

const productRepo = new ProductRepo()

module.exports = productRepo