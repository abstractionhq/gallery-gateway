/* eslint-disable no-unused-expressions */

import { expect } from 'chai'
import crypto from 'crypto'
import fs from 'fs'
import JSZip from 'jszip'
import path from 'path'
import request from 'supertest'

import server from '../../server'
import config from '../../config'
import { fakeShow, fakeImageEntry, fakeGroup, fakeUser } from '../factories'
import User from '../../models/user'
import { signToken } from '../../helpers/jwt';
import { ADMIN, STUDENT } from '../../constants';

const binaryParser = (res, callback) => {
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

const hash = (data) => crypto.createHash('md5').update(data).digest('hex')

describe('downloading a zip file', () => {
  const fileAPath = path.join(config.get('upload:imageDir'), 'imageA.jpg')
  const fileBPath = path.join(config.get('upload:imageDir'), 'imageB.jpg')
  const fileAHash = hash(fs.readFileSync(path.join(__filename, '../../resources/validTest.jpg')))
  const fileBHash = hash(fs.readFileSync(path.join(__filename, '../../resources/validTest2.jpg')))
  const token = signToken({type: ADMIN, username: 'myuser1'})

  before(() => {
    // move the test resources into place, as if they were uploaded
    fs.copyFileSync(
      path.join(__filename, '../../resources/validTest.jpg'),
      fileAPath
    )
    fs.copyFileSync(
      path.join(__filename, '../../resources/validTest2.jpg'),
      fileBPath
    )
  })

  after(() => {
    fs.unlinkSync(fileAPath)
    fs.unlinkSync(fileBPath)
  })

  it('forbids non-admins', () =>
    request(server)
      .get(`/zips/1?token=${signToken({type: STUDENT, username: 'myuser2'})}`)
      .expect(401)
  )

  it('requires a token', () =>
    request(server)
      .get(`/zips/1`)
      .expect(401)
  )

  it('404s on non-existing shows', () =>
    request(server)
      .get(`/zips/1?token=${token}`)
      .expect(404)
  )

  it('Downloads an empty zip for a show with no submissions', () =>
    fakeShow({name: 'myShow'})
      .then(show =>
        request(server)
          .get(`/zips/${show.id}?token=${token}`)
          .buffer()
          .parse(binaryParser)
          .expect(200)
          .expect(res => {
            expect(res.headers['content-disposition'])
              .to.eq('attachment; filename="myShow.zip"', 'file name must be show name')
          })
          .then(res => JSZip.loadAsync(res.body))
          .then(zip => {
            expect(Object.keys(zip.files).length)
              .to.eq(0, 'should have no files')
          })
      )
  )

  it('Downloads a single student submitted image', () =>
    fakeImageEntry({invited: true, path: 'imageA.jpg'})
      .then(entry =>
        // ok now get the user that was just created
        User.findById(entry.studentUsername)
          .then(user =>
            request(server)
              .get(`/zips/${entry.showId}?token=${token}`)
              .buffer()
              .parse(binaryParser)
              .expect(200)
              .then(res => JSZip.loadAsync(res.body))
              .then(zip => {
                // Expect the zip to have
                // a folder invited/ and
                // a file invited/<expected title>.jpg -- with appropriate content
                expect(Object.keys(zip.files).length)
                  .to.eq(2, 'should have only one file and one directory')
                expect(zip.files['invited/']).to.exist
                const zobj = zip.file(
                  `invited/${user.lastName} ${user.firstName} - ${entry.title}.jpg`
                )
                return zobj.async('nodebuffer')
                  .then(buf => {
                    expect(hash(buf)).to.eq(fileAHash)
                  })
              })
          )
      )
  )

  it('downloads a single group-submitted image', () =>
    fakeGroup()
      .then(group =>
        fakeImageEntry({invited: true, path: 'imageB.jpg', group: group})
          .then(entry =>
            request(server)
              .get(`/zips/${entry.showId}?token=${token}`)
              .buffer()
              .parse(binaryParser)
              .expect(200)
              .then(res => JSZip.loadAsync(res.body))
              .then(zip => {
                // Expect the zip to have
                // a folder invited/ and
                // a file invited/<expected title>.jpg -- with appropriate content
                expect(Object.keys(zip.files).length)
                  .to.eq(2, 'should have only one file and one directory')
                expect(zip.files['invited/']).to.exist
                const zobj = zip.file(
                  `invited/${group.name} - ${entry.title}.jpg`
                )
                return zobj.async('nodebuffer')
                  .then(buf => {
                    expect(hash(buf)).to.eq(fileBHash)
                  })
              })
          )
      )
  )

  it('disambiguates untitled submissions', () =>
    Promise.all([fakeShow(), fakeUser()])
      .then(([show, user]) =>
        Promise.all([
          fakeImageEntry({title: 'Untitled', path: 'imageA.jpg', invited: true, user, show}),
          fakeImageEntry({title: 'Untitled', path: 'imageB.jpg', invited: true, user, show})
        ]).then(([entry1, entry2]) =>
          request(server)
            .get(`/zips/${show.id}?token=${token}`)
            .buffer()
            .parse(binaryParser)
            .expect(200)
            .then(res => JSZip.loadAsync(res.body))
            .then(zip => {
              expect(Object.keys(zip.files).length)
                .to.eq(3, 'should have one folder and two files')
              expect(zip.files['invited/']).to.exist
              const zobj1 = zip.file(
                `invited/${user.lastName} ${user.firstName} - Untitled.jpg`
              )
              const zobj2 = zip.file(
                `invited/${user.lastName} ${user.firstName} - Untitled (1).jpg`
              )
              return zobj1.async('nodebuffer')
                .then(buf => {
                  expect(hash(buf)).to.eq(fileAHash)
                })
                .then(() => zobj2.async('nodebuffer'))
                .then(buf => {
                  expect(hash(buf)).to.eq(fileBHash)
                })
            })
        )
      )
  )

  it('creates non-invited folder for submissions correctly', () =>
    fakeImageEntry({invited: false, path: 'imageA.jpg'})
      .then(entry =>
        request(server)
          .get(`/zips/${entry.showId}?token=${token}`)
          .buffer()
          .parse(binaryParser)
          .expect(200)
          .then(res => JSZip.loadAsync(res.body))
          .then(zip => {
            expect(Object.keys(zip.files).length).to.eq(2)
            expect(zip.files['not invited/']).to.exist
            expect(zip.files['invited/']).to.not.exist
          })
      )
  )
})
