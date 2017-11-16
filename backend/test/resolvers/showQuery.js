/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import db from '../../config/sequelize'
import Show from '../../models/show'
import { show, shows } from '../../resolvers/queries/showQuery'
import { fakeShow } from '../factories'

describe('Show Queries', function () {
  beforeEach(function (done) {
    db.sync({force: true}).then(() => {
      Show
        .destroy({where: {}})
        .then(() => done())
    })
  })
  afterEach(function (done) {
    Show
      .destroy({where: {}})
      .then(() => done())
  })

  describe('Show query', function () {
    it('Finds a show given the id', function (done) {
      fakeShow().then((s) => {
        show('', {id: s.id}, {auth: {type: 'ADMIN'}})
          .then((result) => {
            expect(result.id).to.equal(s.id)
            expect(result.entryCap).to.equal(s.entryCap)
            done()
          })
      })
    })
  })

  describe('Shows query', function () {
    it('Gets all shows', function (done) {
      Promise.all([fakeShow(), fakeShow()]).then(() => {
        shows('', {}, {auth: {type: 'ADMIN'}}).then((result) => {
          expect(result.length).to.equal(2)
          done()
        })
      })
    })
    it('Gets all shows in order if requested', function (done) {
      Promise.all([fakeShow({name: 'a', entryStart: '2001-11-20'}),
        fakeShow({name: 'b', entryStart: '2001-11-15'})]).then(() => {
        shows('', {orderBy: { sort: 'entryStart', direction: 'DESC' }},
          {auth: {type: 'ADMIN'}}).then((result) => {
          expect(result.length).to.equal(2)
          expect(result[0].name).to.equal('a')
          done()
        })
      })
    })
  })
})
