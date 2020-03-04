import OldEntry from '../../models/oldEntry'
import Entry from '../../models/entry'
import SinglePiece from '../../models/singlePiece';
import db from "../../config/sequelize";
'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return db.transaction(t => {
    return OldEntry.findAll({transaction: t})
      .then(entries => {
        const pieces = entries.reduce((pieces, entry) => {
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
          return queryInterface.bulkInsert('singlePieces', pieces, {transaction: t})
        .then(() => {
          const entryUpdates = entries.reduce((entryUpdates, entry) => {
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
            return Entry.bulkCreate(entryUpdates, {updateOnDuplicate: ["pieceId", "entryType"]}, {transaction: t})
          }
        })
      }})
    })
  },

  down: (queryInterface, Sequelize) => {
    /*
      no down necessary since we don't actually lose any data here, we just add it
    */
  }
};
