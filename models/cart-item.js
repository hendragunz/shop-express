import Sequelize from "sequelize";
import sequelize from "../util/database.js";

const CartItem = sequelize.define("cartItem", {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  quantity: Sequelize.DataTypes.INTEGER,
});

export default CartItem;
