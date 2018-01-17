import request from 'supertest'
import server from '../../server'
import { expect } from 'chai'
import { signUserToken } from '../util'
import { fakeUser } from '../factories'

describe('API Routes', function () {
  describe('GET /unknownroute', function () {
    // Testing the status 404 for task not found
    it('Returns status 404 when id is not found', function (done) {
      request(server)
        .get('/unknownroute/')
        .expect(404, done)
    })
  })

  describe('Simple GraphQL auth', function () {
    it('rejects getting all users when not logged in', function (done) {
      request(server)
        .post('/graphql')
        .send({'query': '{users {username}}'})
        .expect((res) => {
          expect(res.body).to.have.property('errors')
          expect(res.body.errors).to.have.lengthOf(1)
        })
        .expect(200)
        .end(done)
    })

    it('lists all users when logged in as admin', function (done) {
      fakeUser({type: 'ADMIN'}).then((user) => {
        const token = signUserToken(user)
        request(server)
          .post('/graphql')
          .set('Authorization', 'Bearer ' + token)
          .send({'query': '{users {username}}'})
          .expect(200, {data: {users: [{username: user.username}]}})
          .end(done)
      })
    })
  })
})
