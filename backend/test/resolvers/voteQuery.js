import { expect } from 'chai'

import { votes } from '../../resolvers/queries/voteQuery'
import {
  fakeVoteReturnShowId, fakeUser,
  fakeImageEntry, fakeShow
} from '../factories'

describe('Vote Queries', function () {
  describe('Votes query', function () {
    it('Allows judges to see their own votes', function (done) {
      const username = 'user77'
      fakeVoteReturnShowId({ user: fakeUser({ username: username }) })
        .then((showId) => {
          votes({}, { judgeUsername: username, showId: showId },
            { auth: { type: 'JUDGE', username: username } })
            .then(result => {
              expect(result[0].judgeUsername).to.equal(username)
              done()
            })
        })
    })
    it('Does not let a judge see a different judge\'s vote', function (done) {
      fakeVoteReturnShowId({ user: fakeUser({ username: 'user100' }) })
        .then((showId) => {
          expect(() => {
            votes({}, { judgeUsername: 'adifferetuser', showId: showId },
              { auth: { type: 'JUDGE', username: 'user100' } })
          }).to.throw(/Permission Denied/)
          done()
        })
    })
    it('lets admins see all votes if no judge username is given', function (done) {
      fakeShow().then((s) => {
        fakeVoteReturnShowId({ entry: fakeImageEntry({ show: s }) })
          .then(() => {
            fakeVoteReturnShowId({ entry: fakeImageEntry({ show: s }) })
              .then((showId) => {
                votes({}, { showId: showId },
                  { auth: { type: 'ADMIN', username: 'abc123' } })
                  .then(result => {
                    expect(result.length).to.equal(2)
                    expect(result[0].judgeUsername).to.not.equal(result[1].judgeUsername)
                    expect(result[0].entryId).to.not.equal(result[1].entryId)
                    done()
                  })
              })
          })
      })
    })
    it('lets admins see the vote from a specific judge', () => {
      const username = 'user77'
      return fakeVoteReturnShowId({ user: fakeUser({ username: username }) })
        .then((showId) => {
          votes({}, { judgeUsername: username, showId: showId },
            { auth: { type: 'ADMIN', username: 'abc123' } })
            .then(result => {
              expect(result.length).to.equal(1)
              expect(result[0].judgeUsername).to.equal(username)
            })
        })
    })
  })
})
