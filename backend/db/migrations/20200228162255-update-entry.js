'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    // need to add default values to be able to run a bulk update
    return Promise.all([
      queryInterface.changeColumn('entries', ['entryType'], {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      }),
      queryInterface.changeColumn('entries', ['entryId'], {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      }),
      queryInterface.changeColumn('entries', ['createdAt'], {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }),
      queryInterface.changeColumn('entries', ['updatedAt'], {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }),
      
      queryInterface.addColumn(
        'entries',
        'pieceId',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        }
      )])
  },

  down: (queryInterface, Sequelize) => {
    
    queryInterface.removeColumn('entries', 'pieceId')
    
  }
};
