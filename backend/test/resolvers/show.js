/* eslint-disable no-unused-expressions */

import { expect } from 'chai'

import Vote from '../../models/vote'
import { createShow, assignToShow, removeFromShow } from '../../resolvers/mutations/show'
import { fakeShow, fakeUser, fakeImageEntry, fakeVoteReturnShowId } from '../factories'
import { execGraphql } from '../util'
import Show from '../../models/show'
import Entry from '../../models/entry';

describe('Show Resolvers', function () {
  describe('Create a show', function () {
    it('Does not allow non-admins', function () {
      expect(() =>
        createShow('', {}, {auth: {type: 'STUDENT', username: 'billy'}})
      ).to.throw(/Permission Denied/)
    })
    it('Does not allow null values', function (done) {
      createShow('', {}, {auth: {type: 'ADMIN'}})
        .catch((err) => {
          expect(err).to.exist
          const result = err.message.match(/notNull Violation/)
          expect(result).to.not.equal(null)
          done()
        })
    })
    it('Creates a show', function (done) {
      const input = { input: {
        name: 'Test Show',
        description: 'Coolest of shows',
        entryCap: 3,
        entryStart: '2015-01-01',
        entryEnd: '2015-01-02',
        judgingStart: '2015-01-03',
        judgingEnd: '2015-01-04'
      }}
      createShow('', input, {auth: {type: 'ADMIN'}})
        .then((show) => {
          expect(show.name).to.eq('Test Show')
          expect(show.entryEnd.getFullYear()).to.eq(2015)
          done()
        })
    })
    it('Validates entry/judging start/end dates', function (done) {
      const input = { input: {
        name: 'Bad Show',
        entryCap: 11,
        entryStart: '2015-01-05',
        entryEnd: '2015-01-04',
        judgingStart: '2015-01-06',
        judgingEnd: '2015-01-07'
      }}
      createShow('', input, {auth: {type: 'ADMIN'}})
        .catch((err) => {
          expect(err).to.exist
          expect(err.message).to.equal('Validation error: Entry start date must be before the entry end date')
          done()
        })
    })
  })
  describe('Delete a show', () => {
    it('does not let non-admins remove a show', () =>
      fakeShow()
        .then(show =>
          execGraphql(`
            mutation {
              deleteShow(id: ${show.id})
            }
          `,
          { type: 'STUDENT' }
          )
            .then(result => {
              expect(result.errors).to.be.length(1)
            })
            .then(() =>
              // expect nothing to have been deleted
              Show.count().then(numShows => {
                expect(numShows).to.eq(1)
              })
            )
        )
    )
    it('removes a simple show', () =>
      fakeShow()
        .then(show =>
          execGraphql(`
            mutation {
              deleteShow(id: ${show.id})
            }
          `,
          { type: 'ADMIN' }
          )
            .then(() => {
              // ensure no shows exist in the db
              return Show.count().then(numShows => {
                expect(numShows).to.eq(0)
              })
            })
        )
    )
    it('removes any attached entries', () =>
      fakeShow()
        .then(show => fakeImageEntry({show}).then(() => show))
        .then(show =>
          execGraphql(`
            mutation {
              deleteShow(id: ${show.id})
            }
          `,
          { type: 'ADMIN' }
          )
            .then(() => {
              // ensure no shows exist in the db
              return Show.count().then(numShows => {
                expect(numShows).to.eq(0)
              })
            })
            .then(() => {
              // ensure no entries exist in the db
              return Entry.count().then(numEntries => {
                expect(numEntries).to.eq(0)
              })
            })
        )
    )
    it('removes despite assigned judges', () =>
      Promise.all([fakeUser({ type: 'JUDGE' }), fakeShow()])
        .then(([judge, show]) =>
          show.addUser(judge)
            .then(() => show)
        )
        .then(show =>
          execGraphql(`
            mutation {
              deleteShow(id: ${show.id})
            }
          `,
          { type: 'ADMIN' }
          )
            .then(() => {
              // ensure no shows exist in the db
              return Show.count().then(numShows => {
                expect(numShows).to.eq(0)
              })
            })
        )
    )
  })
  describe('Assign to show', function () {
    it('Does not allow non-admins', function () {
      expect(() =>
        assignToShow('', {}, {auth: {type: 'STUDENT', username: 'billy'}})
      ).to.throw(/Permission Denied/)
    })
    it('Notifies when show does not exist', function (done) {
      const input = {show: 50, usernames: ['user1']}
      assignToShow('', input, {auth: {type: 'ADMIN'}})
        .catch((err) => {
          expect(err).to.exist
          expect(err.message).to.equal('Show Not Found')
          done()
        })
    })
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
  describe('Unassign from show', function () {
    it('Does not allow non-admins', function () {
      expect(() =>
        removeFromShow('', {}, {auth: {type: 'STUDENT', username: 'billy'}})
      ).to.throw(/Permission Denied/)
    })
    it('Notifies when show does not exist', () =>
      fakeShow().then(show => {
        const input = {showId: show.id, usernames: ['user1']}
        return removeFromShow('', input, {auth: {type: 'ADMIN'}})
          .catch((err) => {
            expect(err).to.exist
            expect(err.message).to.equal('Show Not Found')
          })
      })
    )
    it('Does not allow an empty list of usernames', function (done) {
      fakeShow().then((s) => {
        expect(() => {
          const input = {showId: s.id, usernames: []}
          removeFromShow('', input, {auth: {type: 'ADMIN'}})
        }).to.throw(/Please input one or more usernames/)
        done()
      })
    })
    it('Removes input users from show', function (done) {
      fakeShow().then((s) => {
        Promise.all([fakeUser({username: 'user1'}), fakeUser({username: 'user2'})]).then(() => {
          const input = {showId: s.id, usernames: ['user1', 'user2']}
          removeFromShow('', input, {auth: {type: 'ADMIN'}})
            .then((result) => {
              expect(result).to.exist
              expect(result).to.equal(true)
              done()
            })
        })
      })
    })
    it('Removes input users\'s votes from the show', () =>
      Promise.all([fakeShow(), fakeUser(), fakeUser()])
        .then(([show, user1, user2]) =>
          show.addUsers([user1.username, user2.username])
            .then(() => fakeImageEntry({show}))
            .then(entry =>
              fakeVoteReturnShowId({entry, user: user1})
                .then(() => fakeVoteReturnShowId({entry, user: user2}))
                .then(() => {
                  const input = {showId: show.id, usernames: [user1.username]}
                  return removeFromShow('', input, {auth: {type: 'ADMIN'}})
                    .then((result) => {
                      expect(result).to.exist
                      expect(result).to.equal(true)
                      // make sure that the judge's vote no longer exists
                      return Vote.count({where: {judgeUsername: user1.username}})
                        .then(count => {
                          expect(count).to.eq(0)
                        })
                        // make sure the second judge's vote still exists
                        .then(() => Vote.count({where: {judgeUsername: user2.username}}))
                        .then(count => {
                          expect(count).to.eq(1)
                        })
                    })
                })
            )
        )
    )
  })
})
