"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("portfolioPeriods", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ""
      },
      numPieces: {
        type: Sequelize.INTEGER,
        allowNull: false,
        min: 1
      },
      entryStart: {
        type: Sequelize.DATE,
        allowNull: false
      },
      entryEnd: {
        type: Sequelize.DATE,
        allowNull: false
      },
      judgingStart: {
        type: Sequelize.DATE,
        allowNull: false
      },
      judgingEnd: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW")
      },
      finalized: 
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("portfolioPeriod");
  }
};
