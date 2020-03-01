'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('pieces', 'title'),
      queryInterface.removeColumn('pieces', 'comment'),
      queryInterface.removeColumn('pieces', 'pieceType'),
      queryInterface.removeColumn('pieces', 'pieceId')
    ])
     //needs to happen after since another column has the same name
      .then(() => {
        return queryInterface.addColumn(
        'pieces',
        'pieceId',
        Sequelize.INTEGER,
        {
          allowNull: false,
          autoIncrement: true,
          references: {
            model: 'singlePiece',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        }
      )
      }
    )
  },

  down: (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.addColumn('pieces', 'title', Sequelize.STRING,
          {
            defaultValue: 'Untitled',
            allowNull: false
          }),
      queryInterface.addColumn('pieces', 'comment', Sequelize.TEXT),
      queryInterface.addColumn('pieces', 'pieceType', Sequelize.INTEGER, {
        allowNull: false,
        defaultValue: 0
        //default value needed since we have no entry to add here
      }),
      queryInterface.removeColumn('entries', 'pieceId')
    ])
    .then(() => 
    //needs to happen after since another column has the same name
      queryInterface.addColumn('pieces', 'pieceId', Sequelize.INTEGER, {
        allowNull: false,
        defaultValue: 0
      }),
    )
  }
};

