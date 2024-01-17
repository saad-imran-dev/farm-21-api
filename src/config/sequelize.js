const { Sequelize } = require("sequelize");

const uri = process.env.DB_URI;

const sequelize = new Sequelize(uri, {
  define: {
    freezeTableName: true,
  },
  logging: false,
});

module.exports = sequelize;
