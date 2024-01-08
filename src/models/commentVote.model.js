const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const table_name = "comment_votes_by_user"

const commentVote = sequelize.define(table_name, {
    vote: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },

}, {
    timestamps: true,
});

module.exports = commentVote
