import db from '../config/sequelize'

after(function (done) {
  db.close().then(() => done())
})
