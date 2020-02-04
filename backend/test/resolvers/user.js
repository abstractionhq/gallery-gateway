/* eslint-disable no-unused-expressions */

import { expect } from 'chai'

import { createJudge, createAdmin, updateUser } from '../../resolvers/mutations/user'
import { fakeUser } from '../factories'

describe('User Resolvers', function () {
  describe('Judge Creation Resolver', function () {
    it('Does now allow non-admins to add a judge', function () {
      expect(() =>
        createJudge('', {}, {auth: {type: 'STUDENT', username: 'billy'}})
      ).to.throw(/Permission Denied/)
      expect(() =>
        createJudge('', {}, {auth: {type: 'JUDGE', username: 'bob'}})
      ).to.throw(/Permission Denied/)
    })

    it('Does not allow duplicate usernames', function (done) {
      fakeUser({type: 'JUDGE'})
        .then((me) => {
          const input = {input: {
            username: me.username,
            firstName: 'Jane',
            lastName: 'Doe'
          }}
          createJudge('', input, {auth: {type: 'ADMIN'}})
            .catch((err) => {
              expect(err).to.exist
              expect(err.message).to.equal('Username Already Exists')
              done()
            })
        })
    })

    it('Does not allow null values', function (done) {
      const input = {input: {username: 'user2'}}
      createJudge('', input, {auth: {type: 'ADMIN'}})
        .catch((err) => {
          expect(err).to.exist
          const result = err.message.match(/notNull Violation/)
          expect(result).to.not.equal(null)
          done()
        })
    })

    it('Creates a judge', function (done) {
      const input = {input: {
        username: 'hey_im_a_judge',
        firstName: 'myFirstName',
        lastName: 'myLastName'
      }}
      createJudge('', input, {auth: {type: 'ADMIN'}})
        .then((user) => {
          expect(user.username).to.eq('hey_im_a_judge')
          expect(user.firstName).to.eq('myFirstName')
          expect(user.lastName).to.eq('myLastName')
          done()
        })
    })

    it('Converts an existing student user to a judge', function (done) {
      fakeUser({type: 'STUDENT'})
        .then((me) => {
          const input = {input: {
            username: me.username,
            firstName: 'Jane',
            lastName: 'Doe'
          }}
          createJudge('', input, {auth: {type: 'ADMIN'}})
            .then((user) => {
              expect(user.username).to.eq(me.username)
              expect(user.firstName).to.eq('Jane')
              expect(user.lastName).to.eq('Doe')
              expect(user.type).to.eq('JUDGE')
              done()
            })
        })
    })

    it('Does not allow admin roles to be changed', function (done) {
      fakeUser({type: 'ADMIN'})
        .then((me) => {
          const input = {input: {
            username: me.username,
            firstName: 'Jane',
            lastName: 'Doe'
          }}
          createJudge('', input, {auth: {type: 'ADMIN'}})
            .catch((err) => {
              expect(err).to.exist
              expect(err.message).to.equal('Administrators cannot have their role changed')
              done()
            })
        })
    })
  })

  describe('Admin Creation Resolver', function () {
    it('Does now allow non-admins to add an admin', function () {
      expect(() =>
        createAdmin('', {}, {auth: {type: 'STUDENT', username: 'billy'}})
      ).to.throw(/Permission Denied/)
      expect(() =>
        createAdmin('', {}, {auth: {type: 'JUDGE', username: 'bob'}})
      ).to.throw(/Permission Denied/)
    })

    it('Does not allow duplicate usernames', function (done) {
      fakeUser({type: 'ADMIN'})
        .then((me) => {
          const input = {input: {
            username: me.username,
            firstName: 'Jane',
            lastName: 'Doe'
          }}
          createAdmin('', input, {auth: {type: 'ADMIN'}})
            .catch((err) => {
              expect(err).to.exist
              expect(err.message).to.equal('Username Already Exists')
              done()
            })
        })
    })

    it('Does not allow null values', function (done) {
      const input = {input: {username: 'user2'}}
      createAdmin('', input, {auth: {type: 'ADMIN'}})
        .catch((err) => {
          expect(err).to.exist
          const result = err.message.match(/notNull Violation/)
          expect(result).to.not.equal(null)
          done()
        })
    })

    it('Converts an existing student user to an admin', function (done) {
      fakeUser({type: 'STUDENT'})
        .then((me) => {
          const input = {input: {
            username: me.username,
            firstName: 'Jane',
            lastName: 'Doe'
          }}
          createAdmin('', input, {auth: {type: 'ADMIN'}})
            .then((user) => {
              expect(user.username).to.eq(me.username)
              expect(user.firstName).to.eq('Jane')
              expect(user.lastName).to.eq('Doe')
              expect(user.type).to.eq('ADMIN')
              done()
            })
        })
    })

    it('Converts an existing judge user to an admin', function (done) {
      fakeUser({type: 'JUDGE'})
        .then((me) => {
          const input = {input: {
            username: me.username,
            firstName: 'Jane',
            lastName: 'Doe'
          }}
          createAdmin('', input, {auth: {type: 'ADMIN'}})
            .then((user) => {
              expect(user.username).to.eq(me.username)
              expect(user.firstName).to.eq('Jane')
              expect(user.lastName).to.eq('Doe')
              expect(user.type).to.eq('ADMIN')
              done()
            })
        })
    })

    it('Creates an admin', function (done) {
      const input = {input: {
        username: 'hey_im_an_admin',
        firstName: 'myFirstName',
        lastName: 'myLastName'
      }}
      createAdmin('', input, {auth: {type: 'ADMIN'}})
        .then((user) => {
          expect(user.username).to.eq('hey_im_an_admin')
          expect(user.firstName).to.eq('myFirstName')
          expect(user.lastName).to.eq('myLastName')
          done()
        })
    })
  })

  describe('Update User Resolver', function(){
    it('Does now allow non-admins to update users', function () {
      expect(() =>
        updateUser('', {}, {auth: {type: 'STUDENT', username: 'billy'}})
      ).to.throw(/Permission Denied/)
      expect(() =>
        updateUser('', {}, {auth: {type: 'JUDGE', username: 'bob'}})
      ).to.throw(/Permission Denied/)
    })

    it('Does now allow a non-existent user to be updated', function (done) {
      const input = {input: {
        username: 'nobody',
        firstName: 'nowhere',
        lastName: 'man',
        hometown: 'nowhere land'
      }}
      updateUser('', input, {auth: {type: 'ADMIN'}})
        .catch((err) => {
          expect(err).to.exist
          expect(err.message).to.equal('User Does Not Exist')
          done()
        })
    })

    it('Does now allow null username', function (done) {
      const input = {input: {
        firstName: 'nowhere',
        lastName: 'man',
        hometown: 'nowhere land'
      }}
      updateUser('', input, {auth: {type: 'ADMIN'}})
        .catch((err) => {
          expect(err).to.exist
          expect(err.message).to.equal('User Does Not Exist')
          done()
        })
    })

    it('Updates hometown', function (done) {
      fakeUser({type: 'STUDENT', hometown:'Smallville'})
        .then((me) => {
          const input = {input: {
            username: me.username,
            firstName: 'Clark',
            lastName: 'Kent',
            hometown: 'Krypton'
          }}
          updateUser('', input, {auth: {type: 'ADMIN'}})
            .then((user)=>{
              expect(user.username).to.eq(me.username)
              expect(user.hometown).to.eq('Krypton')
              done()
            })
        })
    })

    it('Does not update other fields', function (done) {
      fakeUser({type: 'STUDENT', firstName: 'Clark', lastName: 'Kent', hometown:'Smallville'})
        .then((me) => {
          const input = {input: {
            username: me.username,
            firstName: 'Bruce',
            lastName: 'Wayne',
            hometown: 'Gotham'
          }}
          updateUser('', input, {auth: {type: 'ADMIN'}})
            .then((user)=>{
              expect(user.username).to.eq(me.username)
              expect(user.firstName).to.eq('Clark')
              expect(user.lastName).to.eq('Kent')
              expect(user.hometown).to.eq('Gotham')
              done()
            })
        })
    })

    it('Allows undefined hometown', function (done) {
      fakeUser({type: 'STUDENT', firstName: 'Clark', lastName: 'Kent', hometown:'Smallville'})
        .then((me) => {
          const input = {input: {
            username: me.username,
            firstName: 'Clark',
            lastName: 'Kent'
          }}
          updateUser('', input, {auth: {type: 'ADMIN'}})
          .then((user)=>{
            expect(user.username).to.eq(me.username)
            expect(user.firstName).to.eq('Clark')
            expect(user.lastName).to.eq('Kent')
            expect(user.hometown).to.be.null
            done()
          })
        })
    })

    it('Allows null hometown', function (done) {
      fakeUser({type: 'STUDENT', firstName: 'Clark', lastName: 'Kent', hometown:'Smallville'})
        .then((me) => {
          const input = {input: {
            username: me.username,
            firstName: 'Clark',
            lastName: 'Kent',
            hometown: null
          }}
          updateUser('', input, {auth: {type: 'ADMIN'}})
          .then((user)=>{
            expect(user.username).to.eq(me.username)
            expect(user.firstName).to.eq('Clark')
            expect(user.lastName).to.eq('Kent')
            expect(user.hometown).to.be.null
            done()
          })
        })
    })

    it('Adds hometown', function (done) {
      fakeUser({type: 'STUDENT', firstName: 'Clark', lastName: 'Kent', hometown:null})
        .then((me) => {
          const input = {input: {
            username: me.username,
            firstName: 'Clark',
            lastName: 'Kent',
            hometown: 'Krypton'
          }}
          updateUser('', input, {auth: {type: 'ADMIN'}})
          .then((user)=>{
            expect(user.username).to.eq(me.username)
            expect(user.firstName).to.eq('Clark')
            expect(user.lastName).to.eq('Kent')
            expect(user.hometown).to.eq('Krypton')
            done()
          })
        })
    })

    it('Does not break if user is not student', function (done) {
      fakeUser({type: 'ADMIN', firstName: 'Clark', lastName: 'Kent', hometown:'Smallville'})
        .then((me) => {
          const input = {input: {
            username: me.username,
            firstName: 'Clark',
            lastName: 'Kent',
            hometown: 'Krypton'
          }}
          updateUser('', input, {auth: {type: 'ADMIN'}})
          .then((user)=>{
            expect(user.username).to.eq(me.username)
            expect(user.firstName).to.eq('Clark')
            expect(user.lastName).to.eq('Kent')
            expect(user.hometown).to.eq('Krypton')
            done()
          })
        })
    })

    it('Does not break if no changes are made', function (done) {
      fakeUser({type: 'ADMIN', firstName: 'Clark', lastName: 'Kent', hometown:'Smallville'})
        .then((me) => {
          const input = {input: {
            username: me.username,
            firstName: 'Clark',
            lastName: 'Kent',
            hometown: 'Smallville'
          }}
          updateUser('', input, {auth: {type: 'ADMIN'}})
          .then((user)=>{
            expect(user.username).to.eq(me.username)
            expect(user.firstName).to.eq('Clark')
            expect(user.lastName).to.eq('Kent')
            expect(user.hometown).to.eq('Smallville')
            done()
          })
        })
    })
  })
})
