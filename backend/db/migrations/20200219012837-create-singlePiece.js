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
    pieceType: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    pieceId: {
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
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW')
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('NOW')
    }
  })
},

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('singlePieces')
  }
};
