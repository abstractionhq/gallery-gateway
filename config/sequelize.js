import Sequelize from 'sequelize';

export default new Sequelize(
    "database",
    "root",
    "password",
    {dialect: "mysql"},
);