const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const table_name = "messages"

const Message = sequelize.define(table_name, {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    }

}, {
    timestamps: true,
    updatedAt: false,
});

module.exports = Message
