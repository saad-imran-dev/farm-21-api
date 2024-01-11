const database = require("./database")

class UserRepo {
    constructor() {
        this.db = database.getDatabase()
    }

    async getUserWithEmail(email) {
        const user = await this.db.users.findAll({
            where: {
                email: email
            }
        })
        console.log(user)
        return user[0]
    }

    async createUser(id, name, email) {
        const user = await this.db.users.create({
            id: id,
            name: name,
            email: email
        })

        return user
    }
}

const userRepo = new UserRepo()

module.exports = userRepo