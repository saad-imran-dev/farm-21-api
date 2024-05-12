const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const table_name = "testamonials"

const Post = sequelize.define(table_name, {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    testamonial: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    receiver: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    writer: {
        type: DataTypes.UUID,
        allowNull: false,
    },

}, {
    timestamps: true,
});

module.exports = Post
