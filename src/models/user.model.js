const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const table_name = "users"

const User = sequelize.define(table_name, {
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
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desc: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false,
    },
    coins: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: false,
    },
    isExpert: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },

}, {
    timestamps: true,
});

module.exports = User
