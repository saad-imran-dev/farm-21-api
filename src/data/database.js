const fs = require('fs');
const sequelize = require('../config/sequelize');

class Database {
    constructor() {
        if (!Database.instance) {
            this.db = {};
            this.loadModels();
            this.relations();
            Database.instance = this;
        }

        return Database.instance;
    }

    loadModels() {
        let files = fs.readdirSync("./src/models");
        files.forEach(file => {
            let model = require(`../models/${file}`);
            this.db[model.name] = model;
        });
    }

    relations() {
        // Message sender relation
        this.db.users.hasMany(this.db.messages, {
            as: "sender",
            foreignKey: "senderId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        });

        // Message receiver relation
        this.db.users.hasMany(this.db.messages, {
            as: "receiver",
            foreignKey: "receiverId",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        });
    }

    getDatabase() {
        return this.db
    }

    async sync() {
        await sequelize.sync({ alter: true })
        console.log(`--> Database and Models synced`)
    }
}

const database = new Database()

module.exports = database;
