/* eslint-disable no-unused-expressions */

import { expect } from 'chai'

import Vote from '../../models/vote'
import { fakeUser, fakeImageEntry } from '../factories'
import { vote } from '../../resolvers/mutations/vote'

describe('Vote Mutation', function () {
    it('accepts a valid vote', function() {
        return Promise.all([fakeUser({type: 'JUDGE'}), fakeImageEntry()])
        .then((models) => {
            const user = models[0]
            const entry = models[1] 
            return user.addShow(entry.showId).then((_ => {
                const args = { input: {
                    judgeUsername: user.username,
                    entryId: entry.id,
                    value: 2
                }}
                return vote({}, args, {auth: {username: user.username, type: 'JUDGE'}})
                .then(() => {
                    return Vote.count().then((num) =>  expect(num).to.equal(1))
                })
            }))
        })
    })
})