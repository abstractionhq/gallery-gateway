import { expect } from 'chai'

import { votes } from '../../resolvers/queries/voteQuery'
import Vote from '../../models/Vote'
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
  })
})