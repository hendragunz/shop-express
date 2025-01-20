import Sequelize from "sequelize";
import sequelize from "../util/database.js";

const Cart = sequelize.define("cart", {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
});

export default Cart;
