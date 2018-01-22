/* eslint-disable no-unused-expressions */

import { expect } from 'chai'

import { entries } from '../../resolvers/queries/entryQuery'
import { fakeImageEntry, fakeVideoEntry } from '../factories'

describe('Entry Queries', function () {
  describe('Entries Query', function () {
    it('Rejects non-admins', function () {
      expect(() => entries('', {}, {auth: {type: 'STUDENT'}}))
        .to.throw('Permission Denied')
    })
    it('Gets an empty list when no entries exist', function () {
      return entries('', {}, {auth: {type: 'ADMIN'}})
        .then((entries) => {
          expect(entries).to.be.length(0)
        })
    })
    it('Gets an image entry when it exists', function () {
      return fakeImageEntry({horizDimInch: 3, vertDimInch: 4})
        .then((entry) => {
          return entries('', {}, {auth: {type: 'ADMIN'}})
            .then((resultEntries) => {
              expect(resultEntries).to.be.length(1)
              expect(resultEntries[0].id).to.equal(entry.id)
              expect(resultEntries[0].title).to.equal(entry.title)
              expect(resultEntries[0].horizDimInch).to.equal(3)
              expect(resultEntries[0].vertDimInch).to.equal(4)
            })
        })
    })
    it('gets a video entry when it exists', function () {
      return fakeVideoEntry({videoId: 'abc123'})
        .then((entry) => {
          return entries('', {}, {auth: {type: 'ADMIN'}})
            .then((resultEntries) => {
              expect(resultEntries).to.be.length(1)
              expect(resultEntries[0].id).to.equal(entry.id)
              expect(resultEntries[0].title).to.equal(entry.title)
              expect(resultEntries[0].provider).to.equal('youtube')
              expect(resultEntries[0].videoId).to.equal('abc123')
            })
        })
    })
    it('Gets two entries when multiple exist', function () {
      return Promise.all([fakeImageEntry(), fakeImageEntry()])
        .then(originalEntries => {
          originalEntries = originalEntries.sort((a, b) => a.id - b.id)
          const entry1 = originalEntries[0]
          const entry2 = originalEntries[1]
          return entries('', {}, {auth: {type: 'ADMIN'}})
            .then((resultEntries) => {
              expect(resultEntries).to.be.length(2)
              resultEntries = resultEntries.sort((a, b) => a.id - b.id)
              expect(resultEntries[0].id).to.equal(entry1.id)
              expect(resultEntries[1].id).to.equal(entry2.id)
            })
        })
    })
    it('Can limit to a certain show', function () {
      return Promise.all([fakeImageEntry(), fakeImageEntry()])
        .then(originalEntries => {
          expect(originalEntries[0].showId).to.not.equal(originalEntries[1].showId)
          return entries('', {showId: originalEntries[0].showId}, {auth: {type: 'ADMIN'}})
            .then((resultEntries) => {
              expect(resultEntries).to.be.length(1)
              expect(resultEntries[0].id).to.equal(originalEntries[0].id)
            })
        })
    })
  })
})
