import Entry from '../../models/entry'
import { expect } from 'chai'
import { createPhoto } from '../../resolvers/mutations/entry'
import { fakeUser, fakeShow } from '../factories'

describe('Entry Mutations', function () {
  describe('Image Creation', function () {
    describe('Successes', function () {
      it('accepts a standard Entry', function () {
        return Promise.all([fakeUser(), fakeShow()])
          .then((models) => {
            const user = models[0]
            const show = models[1]
            const args = {
              input: {
                entry: {
                  studentUsername: user.username,
                  showId: show.id,
                  title: 'mytitle',
                  comment: 'this is my comment',
                  forSale: false,
                  yearLevel: 'second',
                  academicProgram: 'learning',
                  moreCopies: false
                },
                path: 'a/path.jpg',
                horizDimInch: 1.2,
                vertDimInch: 1.3,
                mediaType: 'mymedia'
              }
            }
            return createPhoto({}, args, {auth: {type: 'ADMIN'}})
              .then(() => {
                // make sure an Entry was created
                return Entry.count().then((num) => expect(num).to.equal(1))
              })
          })
      })
    })
    describe('Validation Failures', function () {
      it('rejects non-admins making an entry for someone other than themself', function () {
        const args = {
          input: {
            entry: {
              studentUsername: 'user2',
              showId: 1,
              title: 'mytitle',
              comment: 'this is my comment',
              forSale: false,
              yearLevel: 'second',
              academicProgram: 'learning',
              moreCopies: false
            },
            path: 'a/path.jpg',
            horizDimInch: 1.2,
            vertDimInch: 1.3,
            mediaType: 'mymedia'
          }
        }
        expect(() => {
          createPhoto({}, args, {auth: {type: 'STUDENT', username: 'user1'}})
        }).to.throw('Permission Denied')
      })

      it('rejects images with invalid dimensions', function () {
        const args = {
          input: {
            entry: {
              studentUsername: 'user1',
              showId: 1,
              title: 'mytitle',
              comment: 'this is my comment',
              forSale: false,
              yearLevel: 'second',
              academicProgram: 'learning',
              moreCopies: false
            },
            path: 'a/path.jpg',
            horizDimInch: -1.2,
            vertDimInch: -1.3,
            mediaType: 'mymedia'
          }
        }
        return createPhoto({}, args, {auth: {type: 'STUDENT', username: 'user1'}})
          .then(() => Promise.reject(new Error('should have rejected')))
          .catch((e) => {
            expect(e.message).to.match(/must be positive/)
            return Promise.resolve()
          })
      })

      it('rejects non-existent show ids', function () {
        const args = {
          input: {
            entry: {
              studentUsername: 'user1',
              showId: 1,
              title: 'mytitle',
              comment: 'this is my comment',
              forSale: false,
              yearLevel: 'second',
              academicProgram: 'learning',
              moreCopies: false
            },
            path: 'a/path.jpg',
            horizDimInch: 1.2,
            vertDimInch: 1.3,
            mediaType: 'mymedia'
          }
        }
        return createPhoto({}, args, {auth: {type: 'STUDENT', username: 'user1'}})
          .then(() => Promise.reject(new Error('should have rejected')))
          .catch((e) => {
            expect(e.message).to.not.equal('should have rejected')
            return Promise.resolve()
          })
      })

      it('rejects entries with neither username nor group set', function () {
        const args = {
          input: {
            entry: {
              showId: 1,
              title: 'mytitle',
              comment: 'this is my comment',
              forSale: false,
              yearLevel: 'second',
              academicProgram: 'learning',
              moreCopies: false
            },
            path: 'a/path.jpg',
            horizDimInch: 1.2,
            vertDimInch: 1.3,
            mediaType: 'mymedia'
          }
        }
        return createPhoto({}, args, {auth: {type: 'ADMIN'}})
          .then(() => Promise.reject(new Error('should have rejected')))
          .catch((e) => {
            expect(e.message).to.match(/Entry must have an entrant/)
            return Promise.resolve()
          })
      })
    })
  })
})
