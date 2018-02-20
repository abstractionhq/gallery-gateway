import { expect } from 'chai'

import Entry from '../../models/entry'
import Group from '../../models/group'
import { createPhoto, createVideo, createOtherMedia } from '../../resolvers/mutations/entry'
import { fakeUser, fakeShow } from '../factories'
import { execGraphql } from '../util'


const standardEntry = (user, show) => ({
  studentUsername: user.username,
  showId: show.id,
  title: 'mytitle',
  comment: 'this is my comment',
  forSale: false,
  yearLevel: 'second',
  academicProgram: 'learning',
  moreCopies: false
})

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
                entry: standardEntry(user, show),
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
      it('accepts a standard Entry with only the schema required input', function () {
        return Promise.all([fakeUser(), fakeShow()])
        .then((models) => {
          const user = models[0]
          const show = models[1]
          const args = {
            input: {
              entry: {
                studentUsername: user.username,
                showId: show.id,
              },
              path: 'a/path.jpg',
              horizDimInch: 1.2,
              vertDimInch: 1.3,
              mediaType: 'mymedia'
            }
          }
          return createPhoto({}, args, {auth: {type: 'ADMIN'}})
            .then((entry) => {
              expect(entry.title).to.equal('Untitled')
              expect(entry.moreCopies).to.equal(false)
              // make sure an Entry was created
              return Entry.count().then((num) => expect(num).to.equal(1))

            })
        })
      })
      it('accepts a Group', function () {
        return Promise.all([fakeUser(), fakeShow()])
          .then((models) => {
            const user = models[0]
            const show = models[1]
            const args = {
              input: {
                entry: {
                  group: {
                    name: 'mygroup1',
                    creatorUsername: user.username,
                    participants: 'uncle jimmy'
                  },
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
              .then((photoEntry) => {
                // make sure a Group was created
                return Group.findOne().then(group => {
                  expect(group.participants).to.equal('uncle jimmy')
                  expect(group.creatorUsername).to.equal(user.username)
                  expect(group.name).to.equal('mygroup1')
                  expect(group.id).to.equal(photoEntry.groupId)
                })
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
            const entry = standardEntry(user, show)
            const createVideo = `mutation {
              createVideo( input: {
                entry: {
                  studentUsername: "${entry.studentUsername}"
                  showId: ${entry.showId}
                  title: "mytitle"
                  comment: "commenting"
                  forSale: false
                  yearLevel: "second"
                  academicProgram: "learning"
                  moreCopies: false
                }
                url:"https://vimeo.com/45196609"
              }){
                provider
                videoId
                yearLevel
              }
            }`
            return execGraphql(createVideo,{type: 'ADMIN'})
            .then(
              result => {
                expect(result.data.createVideo.provider).to.equal('vimeo')
                expect(result.data.createVideo.videoId).to.equal('45196609')
                expect(result.data.createVideo.yearLevel).to.equal('second')
              }
            )
          })
      })
      it('accepts a standard youtube entry', function () {
        return Promise.all([fakeUser(), fakeShow()])
        .then((models) => {
          const user = models[0]
          const show = models[1]
          const entry = standardEntry(user, show)
          const createVideo = `mutation {
            createVideo( input: {
              entry: {
                studentUsername: "${entry.studentUsername}"
                showId: ${entry.showId}
                title: "mytitle"
                comment: "commenting"
                forSale: false
                yearLevel: "third"
                academicProgram: "learning"
                moreCopies: false
              }
              url:"https://www.youtube.com/watch?v=JHAReoWi-nE"
            }){
              provider
              videoId
              yearLevel
            }
          }`
          return execGraphql(createVideo, {type: 'ADMIN'})
          .then(
            result => {
              expect(result.data.createVideo.provider).to.equal('youtube')
              expect(result.data.createVideo.videoId).to.equal('JHAReoWi-nE')
              expect(result.data.createVideo.yearLevel).to.equal('third')
            }
          )
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
            url: 'https://vimeo.com/45196609'
          }
        }
        expect(() => {
          createVideo({}, args, {auth: {type: 'STUDENT', username: 'user1'}})
        }).to.throw('Permission Denied')
      })
    })
  })
  describe('OtherMedia Creation', function () {
    describe('Successes', function () {
      it('accepts a path string', function () {
        return Promise.all([fakeUser(), fakeShow()])
        .then((models) => {
          const user = models[0]
          const show = models[1]
          const entry = standardEntry(user, show)
          const createVideo = `mutation {
            createOtherMedia( input: {
              entry: {
                studentUsername: "${entry.studentUsername}"
                showId: ${entry.showId}
                title: "mytitle"
                comment: "commenting"
                forSale: false
                yearLevel: "second"
                academicProgram: "learning"
                moreCopies: false
              }
              path:"foo.jpg"
            }){
              path
            }
          }`
          return execGraphql(createVideo,{type: 'ADMIN'})
          .then(
            result => {
              expect(result.data.createOtherMedia.path).to.equal('foo.jpg')
            }
          )
        })
      })
    })
    describe('Failures', function () {
      it('denies users submitting for someone else', function () {
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
            path: 'a/path.jpg'
          }
        }
        expect(() => {
          createOtherMedia({}, args, {auth: {type: 'STUDENT', username: 'user1'}})
        }).to.throw('Permission Denied')
      })
    })
  })
})
