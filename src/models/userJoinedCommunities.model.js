const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");

const table_name = "user_joined_communities";

const UserJoinedCommunities = sequelize.define(
  table_name,
  {},
  {
    timestamps: false,
  }
);

module.exports = UserJoinedCommunities;
