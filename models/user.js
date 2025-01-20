import Sequelize from "sequelize";
import sequelize from "../util/database.js";

const User = sequelize.define("user", {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.DataTypes.STRING,
  email: Sequelize.DataTypes.STRING,
});

export default User;
