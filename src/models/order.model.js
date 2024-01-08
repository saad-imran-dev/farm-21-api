const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const table_name = "orders"

const Order = sequelize.define(table_name, {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },

}, {
    timestamps: true,
    updatedAt: false,
});

module.exports = Order
