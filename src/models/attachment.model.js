const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const table_name = "attachments"

const Attachment = sequelize.define(table_name, {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    fileName: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

}, {
    timestamps: true,
    updatedAt: false,
});

module.exports = Attachment
