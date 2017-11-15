/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import db from '../../config/sequelize'
import Show from '../../models/show'
import { createShow, assignToShow } from '../../resolvers/mutations/show'
import { fakeShow, fakeUser } from '../factories'

describe('Show Resolvers', function () {
  describe('Assign to show', function () {
    describe('handles show input', function () {
      it('Notifies when show does not exist', function (done) {
        const input = {show: 50, usernames: ['user1']}
        assignToShow('', input, {auth: {type: 'ADMIN'}})
          .catch((err) => {
            expect(err).to.exist
            expect(err.message).to.equal('Show Not Found')
            done()
          })
      })
    })
    describe('handles username input', function () {
      it('Notifies when any of the given usernames are not valid ', function (done) {
        fakeShow().then((s) => {
          const input = {showId: s.id, usernames: ['notAUserInTheSystem']}
          assignToShow('', input, {auth: {type: 'ADMIN'}})
            .catch((err) => {
              expect(err).to.exist
              expect(err.message).to.equal('Cannot find one or more usernames')
              done()
            })
        })
      })

      it('Does not allow an empty list of usernames', function (done) {
        fakeShow().then((s) => {
          const input = {showId: s.id, usernames: []}
          assignToShow('', input, {auth: {type: 'ADMIN'}})
            .catch((err) => {
              expect(err).to.exist
              expect(err.message).to.equal('Please input one or more usernames')
              done()
            })
        })
      })
      it('Assigns users', function (done) {
        fakeShow().then((s) => {
          Promise.all([fakeUser({username: 'user1'}), fakeUser({username: 'user2'})]).then(() => {
            const input = {showId: s.id, usernames: ['user1', 'user2']}
            assignToShow('', input, {auth: {type: 'ADMIN'}})
              .then((result) => {
                expect(result).to.exist
                expect(result).to.equal(true)
                done()
              })
          })
        })
      })
    })
  })
})
