const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const table_name = "comments"

const Comment = sequelize.define(table_name, {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, {
    timestamps: true,
});

module.exports = Comment
