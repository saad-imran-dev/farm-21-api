const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const table_name = "communities"

const Community = sequelize.define(table_name, {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: false,
    },

}, {
    timestamps: true,
});

module.exports = Community
