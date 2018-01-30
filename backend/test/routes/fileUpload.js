import request from 'supertest'
import server from '../../server'
import { expect } from 'chai'
import uploader from '../../upload'
import fs from 'fs'
import nconf from '../../config'
import { fakeUser } from '../factories'
import { signUserToken } from '../util'

const image_dir = nconf.get('upload:imageDir')
const pdf_dir = nconf.get('upload:pdfDir')

describe('Image upload', function (){
    it('saves valid images from students at expected location', function(done) {
        fakeUser({username: 'user1', type: 'STUDENT'})
        .then((user) => { 
            const token = signUserToken(user)
            request(server)
            .post('/static/upload/image')
            .set('Authorization', 'Bearer ' + token)
            .attach('image', 'test/resources/validTest.jpg')
            .expect((res) => {
                expect(res.body).to.have.property('path')
                expect(fs.existsSync(image_dir + '/' + 
                    res.body.path)).to.be.true
            })
            .expect(201)
            .end(done)
        })
    })
    it('saves valid images from admin at expected location', function(done) {
        fakeUser({username: 'user2', type: 'ADMIN'})
        .then((user) => { 
            const token = signUserToken(user)
            request(server)
            .post('/static/upload/image')
            .set('Authorization', 'Bearer ' + token)
            .attach('image', 'test/resources/validTest.jpg')
            .expect((res) => {
                expect(res.body).to.have.property('path')
                expect(fs.existsSync(image_dir + '/' + 
                    res.body.path)).to.be.true
            })
            .expect(201)
            .end(done)
        })
    })
    it('does not save png files', function(done) {
        fakeUser({username: 'user2', type: 'ADMIN'})
        .then((user) => {
            const token = signUserToken(user)
            request(server)
            .post('/static/upload/image')
            .set('Authorization', 'Bearer ' + token)
            .attach('image', 'test/resources/150x150.png')
            .expect((res) => {
                expect(res.body.error).to.equal('No JPEG Provided')
            })
            .expect(400)
            .end(done) 
        })
    })

    it('does not save files that are too large', function(done) {
        fakeUser({username: 'user2', type: 'ADMIN'})
        .then((user) => {
            const token = signUserToken(user)
            request(server)
            .post('/static/upload/image')
            .set('Authorization', 'Bearer ' + token)
            .attach('image', 'test/resources/58MbImage.jpg')
            .expect(413)
            .end(done)
        })   
    })

    it('does not allow multiple images to be uploaded in on request', function(done){
        fakeUser({username: 'user2', type: 'ADMIN'})
        .then((user) => {
            const token = signUserToken(user)
            request(server)
            .post('/static/upload/image')
            .set('Authorization', 'Bearer ' + token)
            .attach('image', 'test/resources/validTest.jpg')
            .attach('image', 'test/resources/validTest.jpg')
            .expect(500)
            .end(done) 
        })
    })
})

describe('PDF upload', function(){
    it('saves valid pdfs at expected location', function(done) {
        fakeUser({username: 'user2', type: 'ADMIN'})
        .then((user) => {
            const token = signUserToken(user)
            request(server)
            .post('/static/upload/pdf')
            .set('Authorization', 'Bearer ' + token)
            .attach('pdf', 'test/resources/pdf-sample.pdf')
            .expect((res) => {
                expect(res.body).to.have.property('path')
                expect(fs.existsSync(pdf_dir + '/' + 
                    res.body.path)).to.be.true
            })
            .expect(201)
            .end(done) 
        })
    })
})
