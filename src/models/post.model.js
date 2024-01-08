const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const table_name = "posts"

const Post = sequelize.define(table_name, {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, {
    timestamps: true,
});

module.exports = Post
