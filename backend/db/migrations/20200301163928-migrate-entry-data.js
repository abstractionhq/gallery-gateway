import OldEntry from '../../models/oldEntry'
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return OldEntry.findAll()
      .then(entries => entries.reduce((pieces, entry) => {
        console.log(entry)
        console.log(pieces)
        pieces.push( 
        {
          id: entry.dataValues.pieceId,
          title: entry.dataValues.title,
          comment: entry.dataValues.comment,
          pieceType: entry.dataValues.entryType,
          pieceId: entry.dataValues.entryId
        })
        return pieces
      }, []))
      .then(pieces => {
        //mysql throws as syntax error if you bulk insert an empty array
        if(pieces.length > 0){
          queryInterface.bulkInsert('singlePieces', pieces)
        }
      })
  },

  down: (queryInterface, Sequelize) => {
    /*
      no down necessary since we don't actually lose any data here, we just add it
    */
  }
};
