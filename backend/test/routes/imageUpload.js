import request from 'supertest'
import server from '../../server'
import { expect } from 'chai'
import uploader from '../../upload'
import fs from 'fs'
import nconf from '../../config'

const image_dir = nconf.get('upload:imageDir')

describe('Image upload', function (){
    it('saves valid images at expected location', function(done) {
        request(server)
        .post('/static/upload')
        .attach('image', 'test/resources/validTest.jpg')
        .expect((res) => {
            expect(res.body).to.have.property('path')
            expect(fs.existsSync(image_dir + '/' + 
                res.body.path)).to.be.true
        })
        .expect(201)
        .end(done)
    })

    it('does not save png files', function(done) {
        request(server)
        .post('/static/upload')
        .attach('image', 'test/resources/150x150.png')
        .expect((res) => {
            expect(res.body.error).to.equal('No JPEG Provided')
        })
        .expect(400)
        .end(done)
    })

    it('does not save files that are too large', function(done) {
        request(server)
        .post('/static/upload')
        .attach('image', 'test/resources/58MbImage.jpg')
        .expect(413)
        .end(done)        
    }).timeout(3000)

    it('does not allow multiple images to be uploaded in on request', function(done){
        request(server)
        .post('/static/upload')
        .attach('image', 'test/resources/validTest.jpg')
        .attach('image', 'test/resources/validTest.jpg')
        .expect(500)
        .end(done)
    })
})
