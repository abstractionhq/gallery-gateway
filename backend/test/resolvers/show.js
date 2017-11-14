/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import db from '../../config/sequelize'
import Show from '../../models/show'
import { createShow, assignToShow } from '../../resolvers/mutations/show'
import { fakeShow, fakeUser } from '../factories'

describe('Show Resolvers', function () {
  describe('Assign to show', function () {
    beforeEach(function (done) {
      db.sync({force: true}).then(() => {
        Show
          .destroy({where: {}})
          .then(() => done())
      })
    })
    afterEach(function (done) {
      Show
        .destroy({where: {}})
        .then(() => done())
    })
    it('Notifies when show does not exist', function (done) {
      const input = {show: 1, usernames: ['user1']}
      assignToShow('', input, {auth: {type: 'ADMIN'}})
        .catch((err) => {
          expect(err).to.exist
          expect(err.message).to.equal('Show Not Found')
          done()
        })
    })

    it('Notifies when any of the given usernames are not valid ', function (done) {
      return fakeShow().then(() => {
        const input = {show: 1, usernames: ['user1']}
        assignToShow('', input, {auth: {type: 'ADMIN'}})
          .catch((err) => {
            expect(err).to.exist
            expect(err.message).to.equal('Cannot find one or more usernames')
          })
      })
    })

    it('Does not allow an empty list of usernames', function (done) {
      fakeShow()
      const input = {show: 1, usernames: []}
      assignToShow('', input, {auth: {type: 'ADMIN'}})
        .catch((err) => {
          expect(err).to.exist
          expect(err.message).to.equal('Please input one or more usernames')
          done()
        })
    })
    it('Assigns users', function (done) {
      fakeShow()
      fakeUser({username: 'user1'})
      fakeUser({username: 'user2'})
      const input = {show: 1, usernames: ['user1', 'user2']}
      assignToShow('', input, {auth: {type: 'ADMIN'}})
        .then((result) => {
          expect(result).to.exist
          expect(result).to.equal(true)
          done()
        })
    })
  })
})
