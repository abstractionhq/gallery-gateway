'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('singlePieces', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    entryType: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    entryId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    title: {
      type: Sequelize.STRING,
      defaultValue: 'Untitled',
      allowNull: false
    },
    comment: {
      type: Sequelize.TEXT
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  })
},

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('singlePieces')
  }
};
