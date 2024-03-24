const productRepo = require("../data/product.repo");

class ProductService {
    constructor() {
        this.repo = productRepo
    }

    async create(name, desc, price, userId) {
        return await this.repo.create(name, desc, price, userId)
    }

    async get(search, page, pageSize) {
        let limit;
        let offset;

        if (page && pageSize) {
            limit = pageSize
            offset = page * pageSize
        }

        return await this.repo.find(search, limit, offset)
    }

    async update(id, name, desc, price) {
        return await this.repo.update(id, name, desc, price)
    }

    async delete(id) {
        return await this.repo.delete(id)
    }
}

const productService = new ProductService()

module.exports = productService