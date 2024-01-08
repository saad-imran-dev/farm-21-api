const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const table_name = "products_in_order"

const productInOrder = sequelize.define(table_name, {
    quantity: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },

}, {
    timestamps: false,
});

module.exports = productInOrder
