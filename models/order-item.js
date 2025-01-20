import Sequelize from "sequelize";
import sequelize from "../util/database.js";

const OrderItem = sequelize.define("orderItem", {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  quantity: Sequelize.DataTypes.INTEGER
});

export default OrderItem;
