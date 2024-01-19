const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const table_name = "post_liked_by_user";

const postLikedByUser = sequelize.define(
  table_name,
  {},
  {
    timestamps: false,
  }
);

module.exports = postLikedByUser;
