import Entry from '../../models/entry'
import { expect } from 'chai'
import { createPhoto, createVideo } from '../../resolvers/mutations/entry'
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
  describe('Video Creation', function () {
    describe('Successes', function () {
      it('accepts a standard vimeo entry', function () {
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
                  forSale: true,
                  yearLevel: 'third',
                  academicProgram: 'learning',
                  moreCopies: false
                },
                url: 'https://vimeo.com/45196609'
              }
            }
            return createVideo({}, args, {auth: {type: 'ADMIN'}})
              .then((video) => {
                return Promise.all([
                  expect(video.provider).to.equal('vimeo'),
                  expect(video.videoId).to.equal('45196609'),
                  expect(video.yearLevel).to.equal('third'),
                  Promise.resolve()
                ])
              })
          })
      })
      it('accepts a standard youtube entry', function () {
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
                  forSale: true,
                  yearLevel: 'third',
                  academicProgram: 'learning',
                  moreCopies: false
                },
                url: 'https://www.youtube.com/watch?v=JHAReoWi-nE'
              }
            }
            return createVideo({}, args, {auth: {type: 'ADMIN'}})
              .then((video) => {
                return Promise.all([
                  expect(video.provider).to.equal('youtube'),
                  expect(video.videoId).to.equal('JHAReoWi-nE'),
                  Promise.resolve()
                ])
              })
          })
      })
    })
    describe('Validation Failures', function () {
      it('rejects invalid video sources', function () {
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
                  forSale: true,
                  yearLevel: 'third',
                  academicProgram: 'learning',
                  moreCopies: false
                },
                url: 'https://www.facebook.com/facebook/videos/10156005054966729/'
              }
            }
            expect(() => {
              createVideo({}, args, {auth: {type: 'STUDENT', username: user.username}})
            }).to.throw('The video URL must be a valid URL from Youtube or Vimeo')
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
            url: 'https://vimeo.com/45196609'
          }
        }
        return createVideo({}, args, {auth: {type: 'STUDENT', username: 'user1'}})
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
            url: 'https://vimeo.com/45196609'
          }
        }
        return createVideo({}, args, {auth: {type: 'ADMIN'}})
          .then(() => Promise.reject(new Error('should have rejected')))
          .catch((e) => {
            expect(e.message).to.match(/Entry must have an entrant/)
            return Promise.resolve()
          })
      })
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
          createVideo({}, args, {auth: {type: 'STUDENT', username: 'user1'}})
        }).to.throw('Permission Denied')
      })
    })
  })
})
