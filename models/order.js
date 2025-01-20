import Sequelize from "sequelize";
import sequelize from "../util/database.js";

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
});

export default Order;
