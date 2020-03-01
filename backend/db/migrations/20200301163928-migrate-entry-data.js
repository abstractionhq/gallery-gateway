import OldEntry from '../../models/oldEntry'
import Entry from '../../models/Entry'
import SinglePiece from '../../models/singlePiece';
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return OldEntry.findAll()
      .then(entries => {
        const pieces = entries.reduce((pieces, entry) => {
        console.log(entry)
        console.log(pieces)
        pieces.push( 
        {
          id: entry.dataValues.id,
          title: entry.dataValues.title,
          comment: entry.dataValues.comment,
          pieceType: entry.dataValues.entryType,
          pieceId: entry.dataValues.entryId
        })
        return pieces
      }, [])
        //mysql throws as syntax error if you bulk insert an empty array
      if(pieces.length > 0){
        return SinglePiece.findAll().then(singlePieces => {
          //if single pieces were already created we can skip the bulk insert
          if(singlePieces.length > 0){
            return Promise.resolve()
          }
          else{
            return queryInterface.bulkInsert('singlePieces', pieces)
          }
        })
        .then(() => {
          const entryUpdates = entries.reduce((entryUpdates, entry) => {
          console.log(entry)
          entryUpdates.push( 
          {
            id: entry.dataValues.id,
            entryType: entry.dataValues.entryType,
            entryId: entry.dataValues.entryId,
            title: entry.dataValues.title,
            moreCopies: entry.dataValues.moreCopies,
            forSale: entry.dataValues.forSale,
            excludeFromJudging: entry.dataValues.excludeFromJudging,
            createdAt: entry.dataValues.createdAt,
            updatedAt: entry.dataValues.updatedAt,
            pieceId: entry.dataValues.id
          })
          return entryUpdates
        }, [])
          //need to change all of the pieceIds on existing entries to match pieces
          if(entryUpdates.length > 0){
            console.log(entryUpdates)
            return Entry.bulkCreate(entryUpdates, {updateOnDuplicate: ["pieceId", "entryType"]})
          }
        })
      }})
  },

  down: (queryInterface, Sequelize) => {
    /*
      no down necessary since we don't actually lose any data here, we just add it
    */
  }
};
