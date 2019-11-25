"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("portfolios", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      portfolioPeriodId: {
        type: Sequelize.INTEGER,
        references: {
          model: "portfolioPeriods",
          key: "id"
        },
        onUpdate: "cascade",
        onDelete: "cascade"
      },
      studentUsername: {
        type: Sequelize.STRING,
        references: {
          model: "users",
          key: "username"
        },
        onUpdate: "cascade",
        onDelete: "cascade"
      },
      yearLevel: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      academicProgram: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      submitted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable('portfolio')
  }
};
