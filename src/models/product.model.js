const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const table_name = "products"

const Product = sequelize.define(table_name, {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },

}, {
    timestamps: true,
});

module.exports = Product
