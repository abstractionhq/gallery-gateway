import Sequelize from 'sequelize';

export default new Sequelize(
    process.env.ABSTRACTION_DBNAME || "database",
    process.env.ABSTRACTION_DBUSER || "root",
    process.env.ABSTRACTION_DBPASS || "password",
    {dialect: "mysql"},
);