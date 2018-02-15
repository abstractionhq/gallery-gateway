/* eslint-disable no-unused-expressions */

import { expect } from 'chai'

import { show, shows } from '../../resolvers/queries/showQuery'
import { fakeShow, fakeImageEntry } from '../factories'

describe('Show Queries', function () {
  describe('Show query', function () {
    it('Finds a show given the id', function (done) {
      fakeShow().then((s) => {
        show('', { id: s.id }, { auth: { type: 'ADMIN' } })
          .then((result) => {
            expect(result.id).to.equal(s.id)
            expect(result.entryCap).to.equal(s.entryCap)
            done()
          })
      })
    })
  })
  describe('Shows query', function () {
    describe('Success', function () {
      it('Gets all shows', function (done) {
        Promise.all([fakeShow(), fakeShow()]).then(() => {
          shows('', {}, { auth: { type: 'ADMIN' } }).then((result) => {
            expect(result.length).to.equal(2)
            done()
          })
        })
      })
      it('Gets all shows in order if requested', function (done) {
        Promise.all([fakeShow({ name: 'a', entryStart: '2001-11-20' }),
        fakeShow({ name: 'b', entryStart: '2001-11-15' })]).then(() => {
          shows('', { orderBy: { sort: 'entryStart', direction: 'DESC' } },
            { auth: { type: 'ADMIN' } }).then((result) => {
              expect(result.length).to.equal(2)
              expect(result[0].name).to.equal('a')
              done()
            })
        })
      })
    })
    describe('Validation', function () {
      it('doesn\'t let a user request shows that are not their own', function () {
        expect(() => shows('', { studentUsername: "aUsername" },
          { auth: { type: 'STUDENT', username: 'differentName' } }))
          .to.throw('Permission Denied')
      })
    })
  })
})
