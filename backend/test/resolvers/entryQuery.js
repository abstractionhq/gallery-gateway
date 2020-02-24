/* eslint-disable no-unused-expressions */

import { expect } from 'chai'

import { entries } from '../../resolvers/queries/entryQuery'
import {
  fakeImageEntry, fakeVideoEntry,
  fakeOtherEntry, fakeVoteReturnShowId, fakeUser, fakeGroup
} from '../factories'

import { execGraphql } from '../util'

describe('Entry Queries', function () {
  describe('Entries Query', function () {
    describe('Validation', function () {
      it('Rejects non-admins who are searching for someone else', () =>
        entries(
          '',
          { studentUsername: 'different' },
          { auth: { type: 'STUDENT', username: 'abc123' } }
        )
          .then(() => { throw new Error('should have rejected promise') })
          .catch(e => expect(e).to.not.match(/should have rejected promise/))
      )
      it('Rejects non-admins who are looking for all entries', () =>
        entries(
          '',
          {},
          { auth: { type: 'STUDENT', username: 'abc123' } }
        )
          .then(() => { throw new Error('should have rejected promise') })
          .catch(e => expect(e).to.not.match(/should have rejected promise/))
      )
      it('Gets an empty list when no entries exist', function () {
        return entries('', {}, { auth: { type: 'ADMIN' } })
          .then((entries) => {
            expect(entries).to.be.length(0)
          })
      })
    })
    describe('Success', function () {
      // GraphQL requires 'fragments' so we can get (Photo, Video, OtherMedia)
      // -specific properties even though the return type is a generic Entry
      const photoFragment = `
        fragment photoFields on Photo {
          path,
          horizDimInch,
          vertDimInch,
          mediaType
        }
      `
      const videoFragment = `
        fragment videoFields on Video {
          provider,
          videoId
        }
      `
      const otherMediaFragment = `
        fragment otherMediaFields on OtherMedia {
          path
        }
      `
      it('Gets an image entry when it exists', () =>
        fakeImageEntry({ title: 'image 1', comment: 'comment', path: 'foo.jpg', horizDimInch: 3, vertDimInch: 4, mediaType: 'mymedia' })
          .then(entry =>
            execGraphql(
              `query {
                entries {
                  id,
                  title,
                  comment,
                  entryType,
                  ...photoFields
                }
              }
              ${photoFragment}
              `,
              { type: 'ADMIN' }
            )
              .then(result => {
                expect(result).to.deep.equal({
                  data: {
                    entries: [
                      {
                        id: `${entry.id}`, // must be cast to a string :(
                        title: 'image 1',
                        comment: 'comment',
                        entryType: 'PHOTO',
                        path: 'foo.jpg',
                        horizDimInch: 3,
                        vertDimInch: 4,
                        mediaType: 'mymedia'
                      }
                    ]
                  }
                })
              })
          )
      )
      it('gets a video entry when it exists', () =>
        fakeVideoEntry({ title: 'video 1', comment: 'comment', videoId: 'abc123', provider: 'youtube' })
          .then(entry => execGraphql(
            `query {
              entries {
                id,
                title,
                comment,
                entryType,
                ...videoFields
              }
            }
            ${videoFragment}
            `,
            { type: 'ADMIN' }
          )
            .then(result => {
              expect(result).to.deep.equal({
                data: {
                  entries: [
                    {
                      id: `${entry.id}`, // must be cast to a string :(
                      title: 'video 1',
                      comment: 'comment',
                      entryType: 'VIDEO',
                      videoId: 'abc123',
                      provider: 'youtube'
                    }
                  ]
                }
              })
            })
          )
      )
      it('gets an other media entry when it exists', () =>
        fakeOtherEntry({ title: 'other 1', comment: 'comment', path: 'foo.jpg' })
          .then(entry => execGraphql(
            `query {
              entries {
                id,
                title,
                comment,
                entryType,
                ...otherMediaFields
              }
            }
            ${otherMediaFragment}
            `,
            { type: 'ADMIN' }
          )
            .then(result => {
              expect(result).to.deep.equal({
                data: {
                  entries: [
                    {
                      id: `${entry.id}`, // must be cast to a string :(
                      title: 'other 1',
                      comment: 'comment',
                      entryType: 'OTHER',
                      path: 'foo.jpg'
                    }
                  ]
                }
              })
            })
          )
      )
      it('Gets all types of entry when multiple exist', function () {
        return Promise.all([
          fakeImageEntry({ path: 'foo1.jpg', horizDimInch: 5, vertDimInch: 6, mediaType: 'mymedia' }),
          fakeVideoEntry({ videoId: 'myvideoid', provider: 'youtube' }),
          fakeOtherEntry({ path: 'foo2.jpg' })
        ])
          .then(([image, video, other]) =>
            execGraphql(
              `query {
                entries {
                  id,
                  title,
                  ...photoFields,
                  ...videoFields,
                  ...otherMediaFields
                }
              }
              ${photoFragment} ${videoFragment} ${otherMediaFragment}
              `,
              { type: 'ADMIN' }
            )
              .then(result => {
                // first let's sort the returned entries by ID so we can
                // do a stable deep equals comparison
                result.data.entries = result.data.entries.sort((e1, e2) => parseInt(e1.id) - parseInt(e2.id))
                expect(result).to.deep.equal({
                  data: {
                    entries: [
                      {
                        id: `${image.id}`, // must be cast to a string :(
                        title: image.title,
                        path: 'foo1.jpg',
                        horizDimInch: 5,
                        vertDimInch: 6,
                        mediaType: 'mymedia'
                      },
                      {
                        id: `${video.id}`,
                        title: video.title,
                        videoId: 'myvideoid',
                        provider: 'youtube'
                      },
                      {
                        id: `${other.id}`,
                        title: other.title,
                        path: 'foo2.jpg'
                      }
                    ].sort((e1, e2) => parseInt(e1.id) - parseInt(e2.id))
                  }
                })
              })
          )
      })
      it('Can limit to a certain show', () =>
        Promise.all([fakeImageEntry(), fakeImageEntry()])
          .then(([image1, image2]) => {
            expect(image1.showId).to.not.equal(image2.showId)
            return execGraphql(
              `query {
                entries(showId: ${image1.showId}) {
                  id
                }
              }`,
              { type: 'ADMIN' }
            )
              .then(result => {
                expect(result.data.entries).to.have.lengthOf(1)
                expect(result.data.entries[0].id).to.eq(`${image1.id}`)
              })
          })
      )
      it('allows students to search for just their own entries', () =>
        // first, set up a fake user, give them a group, and make three entries:
        // one from the user, one from the group, and one from someone else
        fakeUser().then(user =>
          Promise.all([fakeImageEntry({ user }), fakeImageEntry()])
            .then(([userEntry, outsiderEntry]) => ({
              user,
              userEntry,
              outsiderEntry
            }))
        )
          // models are made, do the graphql query
          .then(({ user, userEntry, outsiderEntry }) =>
            execGraphql(
              `query {
              entries(studentUsername: "${user.username}") {
                id
                student {
                  username
                }
              }
            }`,
              { type: 'STUDENT', username: user.username }
            )
              // ensure proper entries were returned
              .then(result => {
                expect(result.data.entries).to.have.lengthOf(1)
                expect(result.data.entries[0]).to.deep.eq({
                  id: `${userEntry.id}`,
                  student: {
                    username: `${user.username}`
                  }
                })
              })
          )
      )
      it('allows students to search for their own entries (including group)', () =>
        // first, set up a fake user, give them a group, and make three entries:
        // one from the user, one from the group, and one from someone else
        fakeUser().then(user =>
          fakeGroup({ user }).then(group =>
            Promise.all([fakeImageEntry({ user }), fakeImageEntry({ group }), fakeImageEntry()])
              .then(([userEntry, groupEntry, outsiderEntry]) => ({
                user,
                group,
                userEntry,
                groupEntry,
                outsiderEntry
              }))
          )
        )
          // models are made, do the graphql query
          .then(({ user, group, userEntry, groupEntry, outsiderEntry }) =>
            execGraphql(
              `query {
                entries(studentUsername: "${user.username}") {
                  id
                }
              }`,
              { type: 'STUDENT', username: user.username }
            )
              // ensure proper entries were returned
              .then(result => {
                expect(result.data.entries).to.have.lengthOf(2)
                expect(result.data.entries).to.deep.contain({ id: `${userEntry.id}` })
                expect(result.data.entries).to.deep.contain({ id: `${groupEntry.id}` })
              })
          )
      )
    })
    describe('Score', function () {
      it('Can return a score on an entry that has votes', () =>
        // make an entry and give it two votes w/ average score 1.5
        fakeImageEntry()
          .then(entry =>
            Promise.all([
              fakeVoteReturnShowId({ entry, value: 1 }),
              fakeVoteReturnShowId({ entry, value: 2 })
            ]).then(() => entry)
          )
          .then(entry =>
            execGraphql(
              `query {
                entries {
                  id,
                  score
                }
              }`,
              { type: 'ADMIN' }
            )
              .then(result => {
                expect(result.data.entries).to.have.lengthOf(1)
                expect(result.data.entries[0]).to.deep.eq({
                  id: `${entry.id}`,
                  score: 1.5
                })
              })
          )
      )
      it('Returns a zero on a score with no votes', () =>
        fakeImageEntry()
          .then(entry =>
            execGraphql(
              `query {
                entries {
                  id,
                  score
                }
              }`,
              { type: 'ADMIN' }
            )
              .then(result => {
                expect(result.data.entries).to.have.lengthOf(1)
                expect(result.data.entries[0]).to.deep.eq({
                  id: `${entry.id}`,
                  score: 0
                })
              })
          )
      )
    })
  })
})
