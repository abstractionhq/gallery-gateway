import { expect } from 'chai'

import { votes } from '../../resolvers/queries/voteQuery'
import {
  fakeVoteReturnShowId, fakeUser,
  fakeImageEntry, fakeShow
} from '../factories'

describe('Vote Queries', function () {
  describe('Votes query', function () {
    it('Allows judges to see their own votes', function () {
      const username = 'user77'
      return fakeVoteReturnShowId({ user: fakeUser({ username: username }) })
        .then((showId) => {
          votes({}, { judgeUsername: username, showId: showId },
            { auth: { type: 'JUDGE', username: username } })
            .then(result => {
              expect(result[0].judgeUsername).to.equal(username)
            })
        })
    })
    it('Does not let a judge see a different judge\'s vote', function () {
      return fakeVoteReturnShowId({ user: fakeUser({ username: 'user100' }) })
        .then((showId) => {
          expect(() => {
            votes({}, { judgeUsername: 'adifferetuser', showId: showId },
              { auth: { type: 'JUDGE', username: 'user100' } })
          }).to.throw(/Permission Denied/)
        })
    })
    it('lets admins see all votes if no judge username is given', function () {
      return fakeShow().then((s) =>
        fakeVoteReturnShowId({ entry: fakeImageEntry({ show: s }) })
          .then(() =>
            fakeVoteReturnShowId({ entry: fakeImageEntry({ show: s }) })
              .then((showId) =>
                votes({}, { showId: showId },
                  { auth: { type: 'ADMIN', username: 'abc123' } })
                  .then(result => {
                    expect(result.length).to.equal(2)
                    expect(result[0].judgeUsername).to.not.equal(result[1].judgeUsername)
                    expect(result[0].entryId).to.not.equal(result[1].entryId)
                  })
              )
          )
      )
    })
    it('lets admins see the vote from a specific judge', function () {
      const username = 'user77'
      return fakeVoteReturnShowId({ user: fakeUser({ username: username }) })
        .then((showId) => {
          return votes(
            {},
            { judgeUsername: username, showId: showId },
            { auth: { type: 'ADMIN', username: 'abc123' } }
          )
            .then(result => {
              expect(result.length).to.equal(1)
              expect(result[0].judgeUsername).to.equal(username)
            })
        })
    })
  })
})
