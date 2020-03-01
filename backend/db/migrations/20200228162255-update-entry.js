'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn(
        'entries',
        'pieceId',
        Sequelize.INTEGER,
        {
          allowNull: false,
          defaultValue: 0,
          references: {
            model: 'singlePiece',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        }
      )
  },

  down: (queryInterface, Sequelize) => {
    
    queryInterface.removeColumn('entries', 'pieceId')
    
  }
};
