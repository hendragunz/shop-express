import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  'express_shop',
  'root',
  'P@ssw0rd', {
    dialect: 'mysql',
    host: 'localhost'
  }
);

export default sequelize;