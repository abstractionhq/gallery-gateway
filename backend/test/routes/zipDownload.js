import { expect } from 'chai'
import fs from 'fs'
import path from 'path'
import request from 'supertest'

import JSZip from 'jszip'

import server from '../../server'
import { signUserToken } from '../util'
import { fakeShow } from '../factories'
import { STUDENT, ADMIN } from '../../constants';


function binaryParser (res, callback) {
  // taken from https://stackoverflow.com/q/13573315
  res.setEncoding('binary')
  res.data = ''
  res.on('data', function (chunk) {
    res.data += chunk
  })
  res.on('end', function () {
    callback(null, Buffer.from(res.data, 'binary'))
  })
}

describe('downloading a zip file', function () {
  const IMAGE_A = path.join(__filename, '../../images/imageA.jpg')
  const IMAGE_B = path.join(__filename, '../../images/imageB.jpg')
  before(() => {
    fs.copyFileSync(
      path.join(__filename, '../../resources/validTest.jpg'),
      IMAGE_A
    )
    fs.copyFileSync(
      path.join(__filename, '../../resources/validTest.jpg'),
      IMAGE_B
    )
  })
  after(() => {
    fs.unlinkSync(IMAGE_A)
    fs.unlinkSync(IMAGE_B)
  })
  xit('forbids non-admins') // TODO (rob) figure out how this works
  it('404s on non-existing shows', function () {
    return request(server)
      .get('/zips/1')
      .expect(404)
  })
  it('Downloads an empty zip for a show with no submissions', function () {
    return fakeShow({name: 'myShow'})
      .then(show => request(server)
        .get(`/zips/${show.id}`)
        .buffer()
        .parse(binaryParser)
        .expect(200)
        .expect(res => {
          expect(res.headers['content-disposition']).to.eq('attachment; filename="myShow.zip"')
        })
        .then(res => JSZip.loadAsync(res.body)
          .then(zip => {
            expect(Object.keys(zip.files).length).to.eq(0, 'should have no files')
          })
        )
      )
  })
})
