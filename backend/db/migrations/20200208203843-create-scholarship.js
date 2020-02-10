"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("scholarships", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      gpa: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      yearStatus: {
        type: Sequelize.STRING,
        allowNull: true
      },
      requiredPhotos: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      fulltime: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      renewable: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      requiresEssay: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      degreePrograms: {
        type: Sequelize.STRING,
        allowNull: true
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
    return queryInterface.dropTable("scholarships");
  }
};
