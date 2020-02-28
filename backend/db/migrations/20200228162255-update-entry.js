import Entry from '../../models/entry'
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
      //transfer any existing data to the singlePiece table
      .then(() => Entry.findAll())
      .then(entries => entries.reduce((pieces, entry) => {
        return pieces.push( 
        {
          id: entry.pieceId,
          title: entry.title,
          comment: entry.comment,
          pieceType: entry.entryType,
          pieceId: entry.entryId
        })
      }, []))
      .then(pieces => {
        //mysql throws as syntax error if you bulk insert an empty array
        if(pieces.length > 0){
          queryInterface.bulkInsert('singlePieces', pieces)
        }
      })
      .then(() => {
        Promise.all([
          queryInterface.removeColumn('entries', 'title'),
          queryInterface.removeColumn('entries', 'comment'),
          queryInterface.removeColumn('entries', 'entryType'),
          queryInterface.removeColumn('entries', 'entryId')
        ])
      })
  },

  down: (queryInterface, Sequelize) => {
    // this won't move the data back into place
    Promise.all([
      queryInterface.addColumn('entries', 'title', Sequelize.STRING,
          {
            defaultValue: 'Untitled',
            allowNull: false
          }),
      queryInterface.addColumn('entries', 'comment', Sequelize.TEXT),
      queryInterface.addColumn('entries', 'entryType', Sequelize.INTEGER, {
        allowNull: false,
        defaultValue: 0
        //default value needed since we have no entry to add here
      }),
      queryInterface.addColumn('entries', 'entryId', Sequelize.INTEGER, {
        allowNull: false,
        defaultValue: 0
      }),
      queryInterface.removeColumn('entries', 'pieceId')
    ])
    
  }
};
