import Uzmug from 'umzug'

import User from '../models/user'
import Show from '../models/show'
import Entry from '../models/entry'
import Group from '../models/group'
import Image from '../models/image'
import Video from '../models/video'
import Other from '../models/other'
import Vote from '../models/vote'
import Scholarship from '../models/scholarship'
import Portfolio from '../models/portfolio'
import PortfolioPeriod from '../models/portfolioPeriod'
import SinglePiece from '../models/singlePiece'
import Piece from '../models/piece'
import db from '../config/sequelize'

before(function () {
  const uzmug = new Uzmug({
    storage: 'sequelize',
    storageOptions: {
      sequelize: db
    },
    logging: console.log,
    migrations: {
      params: [ db.getQueryInterface(), db.Sequelize ],
      path: './db/migrations'
    }
  })
  return db.transaction(transaction =>
    db.query('SET FOREIGN_KEY_CHECKS = 0', {transaction})
      .then(() =>
        db.dropAllSchemas({transaction})
      )
      .then(() => {
        return db.query('SET FOREIGN_KEY_CHECKS = 1', {transaction})
      })
  )
    .then(() => uzmug.up())
})

beforeEach(function () {
  return db.transaction((t) => {
    return db.query('SET FOREIGN_KEY_CHECKS = 0', {transaction: t})
      .then(() => {
        return Promise.all(
          [
            User,
            Show,
            Entry,
            Group,
            Image,
            Video,
            Other,
            Vote,
            Scholarship,
            PortfolioPeriod,
            Portfolio,
            Piece,
            SinglePiece
          ].map(model => model.destroy({ where: {}, transaction: t }))
        );
      })
      .then(() => {
        return db.query('SET FOREIGN_KEY_CHECKS = 1', {transaction: t})
      })
  })
})

after(function () {
  return db.close()
})
