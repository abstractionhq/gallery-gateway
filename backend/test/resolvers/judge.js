/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import db from '../../config/sequelize'
import User from '../../models/user'
import { createJudge, updatePermissions } from '../../resolvers/mutations/judge'
import { fakeUser } from '../factories'

describe('Judge Resolvers', function () {
  describe('Judge Creation Resolver', function () {
    it('Does not allow duplicate usernames', function (done) {
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
  })

  describe('Update Permissions Resolver', function () {
    it('Changes a Student to a Judge', function (done) {
      const input = {input: {
        username: 'user3'
      }}

      fakeUser({
        username: 'user3',
        type: 'STUDENT'
      })
        .then(() => {
          updatePermissions('', input, {auth: {type: 'ADMIN'}})
            .then((result) => {
              expect(result.dataValues.username).to.equal('user3')
              expect(result.dataValues.type).to.equal('JUDGE')
              done()
            })
        })
    })

    it('Changes a Judge to an Admin', function (done) {
      const input = {input: {
        username: 'user4'
      }}

      fakeUser({
        username: 'user4',
        type: 'JUDGE'
      })
        .then(() => {
          updatePermissions('', input, {auth: {type: 'ADMIN'}})
            .then((result) => {
              expect(result.dataValues.username).to.equal('user4')
              expect(result.dataValues.type).to.equal('ADMIN')
              done()
            })
        })
    })

    it('Does not modify an Admin', function (done) {
      const input = {input: {
        username: 'user5'
      }}

      fakeUser({
        username: 'user5',
        type: 'ADMIN'
      })
        .then(() => {
          updatePermissions('', input, {auth: {type: 'ADMIN'}})
            .then((result) => {
              expect(result.dataValues.username).to.equal('user5')
              expect(result.dataValues.type).to.equal('ADMIN')
              done()
            })
        })
    })

    it('Allows a user type to be specified', function (done) {
      const input = {input: {
        username: 'user7',
        type: 'STUDENT'
      }}

      fakeUser({
        username: 'user7',
        type: 'JUDGE'
      })
        .then(() => {
          updatePermissions('', input, {auth: {type: 'ADMIN'}})
            .then((result) => {
              expect(result.dataValues.username).to.equal('user7')
              expect(result.dataValues.type).to.equal('STUDENT')
              done()
            })
        })
    })
  })
})
