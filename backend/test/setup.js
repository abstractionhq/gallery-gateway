import User from '../models/user'
import Show from '../models/show'
import Entry from '../models/entry'
import Group from '../models/group'
import Image from '../models/image'
import Video from '../models/video'
import Other from '../models/other'
import db from '../config/sequelize'

before(function () {
  return db.sync({force: true})
})

beforeEach(function () {
  return db.transaction((t) => {
    return db.query('SET FOREIGN_KEY_CHECKS = 0', {transaction: t})
      .then(() => {
        return Promise.all(
          [User, Show, Entry, Group, Image, Video, Other]
            .map((model) => model.destroy({where: {}, transaction: t}))
        )
      })
      .then(() => {
        return db.query('SET FOREIGN_KEY_CHECKS = 1', {transaction: t})
      })
  })
})

after(function () {
  return db.close()
})
