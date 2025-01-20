const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define(
  "product",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: Sequelize.DataTypes.STRING,
    price: {
      type: Sequelize.DataTypes.DOUBLE,
      allowNull: false
    },
    description: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false
    },
    imageUrl: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    }
  }
);

module.exports = Product;