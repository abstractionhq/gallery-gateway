/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import db from '../../config/sequelize'
import User from '../../models/user'
import { user, users } from '../../resolvers/queries/userQuery'
import { fakeUser } from '../factories'
import { STUDENT, JUDGE, ADMIN } from '../../constants'

describe('User Queries', function () {
  describe('User query', function () {
    it('Allows users to find themeselves', function (done) {
      fakeUser({username: 'user1'}).then((u) => {
        user('', {id: u.username}, {auth: {type: 'STUDENT', id: 'user1'}})
          .then((result) => {
            expect(result.username).to.equal(u.username)
            done()
          })
      })
    })
    it('Does not allow non admins to find other users by username', function (done) {
      fakeUser({username: 'user1'}).then((u) => {
        expect(() => user('', {id: 'anotheruser'},
          {auth: { type: 'STUDENT', id: 'user1' }})).to.throw(/Permission Denied/)
        done()
      })
    })
    it('Allows admin to search for anyone', function (done) {
      Promise.all([fakeUser({username: 'user1', type: ADMIN}),
        fakeUser({username: 'user2', type: JUDGE})]).then(() => {
        user('', {id: 'user2'}, {auth: {type: 'ADMIN'}})
          .then((result) => {
            expect(result.username).to.equal('user2')
            done()
          })
      })
    })
  })
  describe('Users query', function () {
    it('gives you all users when you do not input a type', function (done) {
      Promise.all([fakeUser({username: 'user1'}), fakeUser({username: 'user2'}), fakeUser({username: 'user3'})]).then(() => {
        users('', {}, {auth: {type: 'ADMIN'}})
          .then((result) => {
            expect(result).to.exist
            expect(result.length).to.equal(3)
            done()
          })
      })
    })
    it('gives you all judges when you request type: JUDGE', function (done) {
      Promise.all([fakeUser({username: 'user1', type: JUDGE}),
        fakeUser({username: 'user2', type: JUDGE}),
        fakeUser({username: 'user3'})]).then(() => {
        users('', {type: JUDGE}, {auth: {type: 'ADMIN'}})
          .then((result) => {
            expect(result.length).to.equal(2)
            expect(result[0].username).to.equal('user1')
            expect(result[1].username).to.equal('user2')
            done()
          })
      })
    })
    it('gives you all students when you request type: STUDENT', function (done) {
      Promise.all([fakeUser({username: 'user1', type: JUDGE}),
        fakeUser({username: 'user2', type: JUDGE}),
        fakeUser({username: 'user3'})]).then(() => {
        users('', {type: STUDENT}, {auth: {type: 'ADMIN'}})
          .then((result) => {
            expect(result.length).to.equal(1)
            expect(result[0].username).to.equal('user3')
            done()
          })
      })
    })
    it('gives you all admins when you request type: ADMIN', function (done) {
      Promise.all([fakeUser({username: 'user1', type: ADMIN}),
        fakeUser({username: 'user2', type: JUDGE}),
        fakeUser({username: 'user3'})]).then(() => {
        users('', {type: ADMIN}, {auth: {type: 'ADMIN'}})
          .then((result) => {
            expect(result.length).to.equal(1)
            expect(result[0].username).to.equal('user1')
            done()
          })
      })
    })
  })
})
