/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import config from '../../config'
import fs from 'fs'
import uuidv4 from 'uuid/v4'
import mkdirp from 'mkdirp'

import Vote from '../../models/vote'
import { createShow, assignToShow, removeFromShow, updateShow } from '../../resolvers/mutations/show'
import { fakeShow, fakeUser, fakeImageEntry, fakeVoteReturnShowId, fakeOtherEntry } from '../factories'
import { execGraphql } from '../util'
import Show from '../../models/show'
import Entry from '../../models/entry'
import Image from '../../models/image'
import Other from '../../models/other'
import SinglePiece from '../../models/singlePiece'

const imageDir = config.get('upload:imageDir')
const pdfDir = config.get('upload:pdfDir')

describe('Show Resolvers', function () {
  describe('Create a show', function () {
    it('Does not allow non-admins', function () {
      expect(() =>
        createShow('', {}, {auth: {type: 'STUDENT', username: 'billy'}})
      ).to.throw(/Permission Denied/)
    })
    it('Does not allow null values', function () {
      expect(() =>
        createShow('', {}, {auth: {type: 'ADMIN'}})
      ).to.throw(/Cannot read property 'entryStart' of undefined/)
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
  describe('Update a show', function () {
    it('Does not allow non-admins', function () {
      expect(() =>
        updateShow('', {}, {auth: {type: 'STUDENT', username: 'billy'}})
      ).to.throw(/Permission Denied/)
    })
    it('Updates a show', function (done) {
      fakeShow().then(show => {
          const input = { id: show.id, input: {
            name: 'Updated Test Show',
            description: 'Coolest-er of shows',
            entryCap: 3,
            entryStart: '2015-01-01',
            entryEnd: '2015-01-02',
            judgingStart: '2015-01-03',
            judgingEnd: '2015-01-04'
        }}
        updateShow('', input, {auth: {type: 'ADMIN'}})
          .then((show) => {
            expect(show.name).to.eq('Updated Test Show')
            expect(show.entryEnd.getFullYear()).to.eq(2015)
            done()
          })}
      )
    })
    it('Validates entry/judging start/end dates', function (done) {
      fakeShow().then(show => {
      const input = { id: show.id, input: {
        name: 'Bad Show',
        entryCap: 11,
        entryStart: '2015-01-05',
        entryEnd: '2015-01-04',
        judgingStart: '2015-01-06',
        judgingEnd: '2015-01-07'
      }}
      updateShow('', input, {auth: {type: 'ADMIN'}})
        .catch((err) => {
          expect(err).to.exist
          expect(err.message).to.equal('Validation error: Entry start date must be before the entry end date')
          done()
        })
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
    it('removes any attached entries', () => {
      const uuid1 = uuidv4()
      const path1 = `${uuid1[0]}/${uuid1[1]}/${uuid1}.jpg`
      const path1thumb = `${uuid1[0]}/${uuid1[1]}/${uuid1}_thumb.jpg`
      mkdirp.sync(`${imageDir}/${uuid1[0]}/${uuid1[1]}`)
      fs.closeSync(fs.openSync(`${imageDir}/${path1}`, 'w'))
      fs.closeSync(fs.openSync(`${imageDir}/${path1thumb}`, 'w'))
      const uuid2 = uuidv4()
      const path2 = `${uuid2[0]}/${uuid2[1]}/${uuid2}.pdf`
      mkdirp.sync(`${pdfDir}/${uuid2[0]}/${uuid2[1]}`)
      fs.closeSync(fs.openSync(`${pdfDir}/${path2}`, 'w'))
      return fakeShow()
        .then(show => fakeImageEntry({show, path: path1}).then(() => show))
        .then(show => fakeOtherEntry({show, path: path2}).then(() => show))
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
                expect(numShows).to.eq(0, 'should have no shows')
              })
            })
            .then(() => {
              // ensure no entries exist in the db
              return Entry.count().then(numEntries => {
                expect(numEntries).to.eq(0, 'should have no entries')
              })
            })
            .then(() => {
              // ensure no singlePieces exist in the db
              return SinglePiece.count().then(numPieces => {
                expect(numPieces).to.eq(0, 'should have no single pieces')
              })
            })
            .then(() => {
              // ensure no Images exist in the db
              return Image.count().then(numImages => {
                expect(numImages).to.eq(0, 'should have no images')
              })
            })
            .then(() => {
              // ensure no Other entries exist in the db
              return Other.count().then(numOthers => {
                expect(numOthers).to.eq(0, 'should have no other entries')
              })
            })
            .then(() => {
              // Ensure that all files were deleted
              expect(
                fs.existsSync(`${imageDir}/${path1}`)
              ).to.eq(false, 'path1 should not exist')
              expect(
                fs.existsSync(`${imageDir}/${path1thumb}`)
              ).to.eq(false, 'path1 should not exist')
              expect(
                fs.existsSync(`${pdfDir}/${path2}`)
              ).to.eq(false, 'path2 should not exist')
            })
        )
    })
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
