const TestamonialRepo = require("../data/testamonial.repo");
const userRepo = require("../data/user.repo");
const BadRequestError = require("../Exceptions/badRequestError");

class TestamonialService {
    constructor() {
        this.repo = new TestamonialRepo()
    }

    async canGiveTestamonial(userId, otherUserId) {
        const [userList, _] = await this.repo.validTestamonialUsers(userId)
        return userList
            .map(u => u.id)
            .includes(otherUserId)
    }

    async create(testamonial, writer, receiver) {
        if (!(await this.canGiveTestamonial(writer, receiver)))
            throw new BadRequestError("User can't write testamonial")
        return await this.repo.create(testamonial, writer, receiver)
    }

    async get(userId) {
        const user = await userRepo.get(userId)
        if (!user) throw new BadRequestError("User doesn't exist")
        let testamonials = await this.repo.get(userId)
        testamonials = testamonials.map(t => t.dataValues)
        return testamonials.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
}

module.exports = TestamonialService