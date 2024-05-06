const productRepo = require("../data/product.repo");
const storage = require("../utils/Storage");

class ProductService {
    constructor() {
        this.repo = productRepo
        this.storage = storage
    }

    async uploadFiles(id, files) {
        await Promise.all(
            files.map(async file => {
                const fileName = `${id}/${Date.now()}_${file.originalname.replace(' ', '_')}`
                await this.repo.addAttachment(fileName, id)
                await this.storage.uploadFile(fileName, file.buffer)
            })
        )

    }

    async deleteFiles(id) {
        const attachments = await this.repo.getAttachment(id)

        await Promise.all(
            attachments.map(
                async attachment => await this.storage.deleteFile(attachment.fileName)
            )
        )
        await this.repo.deleteAttachment(id)
    }

    async create(name, desc, price, phone, userId, files) {
        const product = await this.repo.create(name, desc, price, phone, userId)
        await this.uploadFiles(product.id, files)
        return product
    }

    async get(search, page, pageSize) {
        let limit;
        let offset;

        if (page && pageSize) {
            limit = pageSize
            offset = (page - 1) * pageSize
        }

        const allProducts = await this.repo.find(search, limit, offset)

        // Convert Attachments from object with file name to urls
        const products = allProducts.products.map(product => {
            product.dataValues.product_attachments = product.dataValues.product_attachments.map(attachment =>
                `${process.env.STORAGE_PUBLIC_URL}${attachment.fileName}`)
            return product.dataValues
        })

        return { ...allProducts, products }
    }

    async update(id, name, desc, price, files) {
        await this.deleteFiles(id)
        const product = await this.repo.update(id, name, desc, price)
        await this.uploadFiles(id, files)
        return product
    }

    async delete(id) {
        await this.deleteFiles(id)
        return await this.repo.delete(id)
    }
}

const productService = new ProductService()

module.exports = productService