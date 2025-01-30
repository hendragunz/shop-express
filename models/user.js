import bcrypt from "bcryptjs";
import Sequelize from "sequelize";
import sequelize from "../util/database.js";

const User = sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: Sequelize.DataTypes.STRING,
    email: Sequelize.DataTypes.STRING,
    password: Sequelize.DataTypes.STRING,
    resetToken: Sequelize.DataTypes.STRING,
    resetTokenExpiration: Sequelize.DataTypes.DATE
  },
  {
    instanceMethods: {
      addToCart: (productId) => {
        return this.save();
      },
      removeFromCart: (productId) => {
        return this.save();
      },
      clearCart: () => {
        this.getCart().then((cart) => {
          cart.setProducts(null).then((results) => {
            return this.save();
          });
        });
      },
    },
  }
);

export default User;
