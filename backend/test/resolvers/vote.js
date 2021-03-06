/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import { fakeUser, fakeImageEntry } from '../factories'
import { vote } from '../../resolvers/mutations/vote'

describe('Vote Mutation', function () {
  describe('Successes', function () {
    it('overwrites a vote with the same username and entryId', function () {
      return Promise.all([fakeUser({ type: 'JUDGE' }), fakeImageEntry()])
        .then((models) => {
          const user = models[0]
          const entry = models[1]
          return user.addShow(entry.showId).then(_ => {
            var args = {
              input: {
                judgeUsername: user.username,
                entryId: entry.id,
                value: 2
              }
            }
            return vote({}, args, { auth: { username: user.username, type: 'JUDGE' } })
              .then(() => {
                args.input.value = 0
                return vote({}, args, { auth: { username: user.username, type: 'JUDGE' } })
                  .then((v) => {
                    expect(v.value).to.equal(0)
                  })
              })
          })
        })
    })
    it('creates a valid vote', function () {
      return Promise.all([fakeUser({ type: 'JUDGE' }), fakeImageEntry()])
        .then((models) => {
          const user = models[0]
          const entry = models[1]
          return user.addShow(entry.showId).then(() => {
            const args = {
              input: {
                judgeUsername: user.username,
                entryId: entry.id,
                value: 2
              }
            }
            return vote({}, args, { auth: { username: user.username, type: 'JUDGE' } })
              .then(vote => {
                expect(vote.judgeUsername).to.equal(user.username)
                expect(vote.entryId).to.equal(entry.id)
                expect(vote.value).to.equal(2)
              })
          })
        })
    })
    it('allows admins to vote as themselves', function () {
      return Promise.all([fakeUser({ type: 'ADMIN' }), fakeImageEntry()])
        .then((models) => {
          const user = models[0]
          const entry = models[1]
          return user.addShow(entry.showId).then(() => {
            const args = {
              input: {
                judgeUsername: user.username,
                entryId: entry.id,
                value: 2
              }
            }
            return vote({}, args, { auth: { username: user.username, type: 'ADMIN' } })
              .then(vote => {
                expect(vote.judgeUsername).to.equal(user.username)
                expect(vote.entryId).to.equal(entry.id)
                expect(vote.value).to.equal(2)
              })
          })
        })
    })
  })
  describe('Validation Failures', function () {
    it('only allows judges to vote as themselves', function () {
      return Promise.all([fakeUser({ type: 'JUDGE' }), fakeImageEntry()])
        .then((models) => {
          const user = models[0]
          const entry = models[1]
          const args = {
            input: {
              judgeUsername: 'someOtherJudge',
              entryId: entry.id,
              value: 2
            }
          }
          expect(() => {
            vote({}, args, { auth: { username: user.username, type: 'JUDGE' } })
          }).to.throw('Permission Denied')
        })
    })
    it('doesn\'t let admins vote for other judges', function () {
      return Promise.all([fakeUser({ type: 'JUDGE' }), fakeImageEntry()])
        .then((models) => {
          const user = models[0]
          const entry = models[1]
          const args = {
            input: {
              judgeUsername: 'someOtherJudge',
              entryId: entry.id,
              value: 2
            }
          }
          expect(() => {
            vote({}, args, { auth: { username: user.username, type: 'ADMIN' } })
          }).to.throw('Permission Denied')
        })
    })
    it('produces a user error when the entry to vote on is not found', function () {
      return fakeUser({ type: 'JUDGE' }).then((judge) => {
        var args = {
          input: {
            judgeUsername: judge.username,
            entryId: 2000,
            value: 2
          }
        }
        return vote({}, args, { auth: { username: judge.username, type: 'JUDGE' } })
          .catch((err) => {
            expect(err.message).to.equal('Cannot find entry')
          })
      })
    })
    it('only allows invited judges to vote', function () {
      return Promise.all([fakeUser({ type: 'JUDGE' }), fakeImageEntry()])
        .then((models) => {
          const user = models[0]
          const entry = models[1]
          const args = {
            input: {
              judgeUsername: user.username,
              entryId: entry.id,
              value: 2
            }
          }
          return vote({}, args, { auth: { username: user.username, type: 'JUDGE' } })
            .catch((err) => {
              expect(err.message).to.equal('Judge is not allowed to vote on this entry')
            })
        })
    })
    it('does not allow out of range votes', function () {
      return Promise.all([fakeUser({ type: 'JUDGE' }), fakeImageEntry()])
        .then((models) => {
          const user = models[0]
          const entry = models[1]
          return user.addShow(entry.showId).then(_ => {
            const args = {
              input: {
                judgeUsername: user.username,
                entryId: entry.id,
                value: 9
              }
            }
            return vote({}, args, { auth: { username: user.username, type: 'JUDGE' } })
              .catch((err) => {
                expect(err.message).to.equal('Validation error: Vote value must be 0, 1, or 2')
              })
          })
        })
    })
  })
})
