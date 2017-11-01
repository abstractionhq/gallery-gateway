/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import db from '../../config/sequelize'
import User from '../../models/user'
import { createJudge, updatePermissions } from '../../resolvers/mutations/judge'

describe('Judge Resolvers', function () {
  before(function (done) {
    db.sync({force: true}).then(() => {
      User
        .destroy({where: {}})
        .then(() => done())
    })
  })
  after(function (done) {
    User
      .destroy({where: {}})
      .then(() => {
        db.close()
        done()
      })
  })

  describe('Judge Creation Resolver', function () {
    it('Does not allow duplicate usernames', function (done) {
      const input = {input: {
        username: 'user1',
        firstName: 'Jane',
        lastName: 'Doe'
      }}
      User.create({
        username: 'user1',
        firstName: 'john',
        lastName: 'smith',
        type: 'ADMIN'
      })
        .then(() => {
          createJudge('', input)
            .catch((err) => {
              expect(err).to.exist
              expect(err.message).to.equal('Username Already Exists')
              done()
            })
        })
    })

    it('Does not allow null values', function (done) {
      const input = {input: {username: 'user2'}}
      createJudge('', input)
        .catch((err) => {
          expect(err).to.exist
          expect(err.message).to.equal('notNull Violation: firstName cannot be null,\nnotNull Violation: lastName cannot be null')
          done()
        })
    })
  })

  describe('Update Permissions Resolver', function () {
    it('Changes a Student to a Judge', function (done) {
      const input = {input: {
        username: 'user3'
      }}

      User.create({
        username: 'user3',
        firstName: 'Adam',
        lastName: 'Savage',
        type: 'STUDENT'
      })
        .then(() => {
          updatePermissions('', input)
            .then((result) => {
              expect(result.dataValues.username).to.equal('user3')
              expect(result.dataValues.type).to.equal('JUDGE')
              done()
            })
        })
    })

    it('Changes a Judge to an Admin', function (done) {
      const input = {input: {
        username: 'user4'
      }}

      User.create({
        username: 'user4',
        firstName: 'Bob',
        lastName: 'Ross',
        type: 'JUDGE'
      })
        .then(() => {
          updatePermissions('', input)
            .then((result) => {
              expect(result.dataValues.username).to.equal('user4')
              expect(result.dataValues.type).to.equal('ADMIN')
              done()
            })
        })
    })

    it('Does not modify an Admin', function (done) {
      const input = {input: {
        username: 'user5'
      }}

      User.create({
        username: 'user5',
        firstName: 'Clark',
        lastName: 'Kent',
        type: 'ADMIN'
      })
        .then(() => {
          updatePermissions('', input)
            .then((result) => {
              expect(result.dataValues.username).to.equal('user5')
              expect(result.dataValues.type).to.equal('ADMIN')
              done()
            })
        })
    })

    it('Allows a user type to be specified', function (done) {
      const input = {input: {
        username: 'user7',
        type: 'STUDENT'
      }}

      User.create({
        username: 'user7',
        firstName: 'Mr',
        lastName: 'Rogers',
        type: 'JUDGE'
      })
        .then(() => {
          updatePermissions('', input)
            .then((result) => {
              expect(result.dataValues.username).to.equal('user7')
              expect(result.dataValues.type).to.equal('STUDENT')
              done()
            })
        })
    })
  })
})
