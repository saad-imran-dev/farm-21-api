const { QueryTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const supabase = require("../config/supabase");
const database = require("./database");

class TestamonialRepo {
    constructor() {
        this.db = database.getDatabase()
    }

    // Users that can be given a testamonial
    async validTestamonialUsers(userId) {
        const UsersQuery = `
        select
            distinct(c."userId") as "id"
        from
            comments c
            join (
                select
                    *
                from
                    posts
                where
                    posts."userId" = '${userId}'
            ) p on p.id = c."postId"
        where
            not c."userId" = '${userId}'
            and c."userId" not in (
                select
                    receiver
                from
                    testamonials
                where
                    writer = '${userId}'
            );
        `
        return await sequelize.query(UsersQuery, QueryTypes.SELECT)
    }

    async create(testamonial, writer, receiver) {
        return await this.db.testamonials.create({
            testamonial, writer, receiver
        })
    }

    async get(receiver) {
        return await this.db.testamonials.findAll({
            where: { receiver },
        })
    }
}

module.exports = TestamonialRepo