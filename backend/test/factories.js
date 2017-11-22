import faker from 'faker'
import User from '../models/user'
import Show from '../models/show'
import Image from '../models/image'
import Entry from '../models/entry'
import { STUDENT, IMAGE_ENTRY, VIDEO_ENTRY, OTHER_ENTRY } from '../constants'

/**
 * Fake a User
 * @param {object} opts - optional, details about the user
 * @param {string} opts.type - type of user, default STUDENT
 * @param {string} opts.username - username, default faked
 * @return {Promise<User>} the user that was made
 */
export function fakeUser (opts) {
  opts = opts || {}
  opts.type = opts.type || STUDENT
  opts.username = opts.username || faker.internet.userName()
  return User.create({
    username: opts.username,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    type: opts.type
  })
}

export function fakeShow (opts) {
  opts = opts || {}
  opts.name = opts.name || faker.name.title()
  opts.description = opts.description || faker.name.jobDescriptor()
  opts.entryCap = opts.entryCap || 3
  opts.entryStart = opts.entryStart || faker.date.between('2015-01-01', '2015-01-02')
  opts.entryEnd = opts.entryEnd || faker.date.between('2015-01-03', '2015-01-04')
  opts.judgingStart = opts.judgingStart || faker.date.between('2015-01-05', '2015-01-06')
  opts.judgingEnd = opts.judgingEnd || faker.date.between('2015-01-07', '2015-01-08')
  opts.moreCopies = opts.moreCopies === undefined ? faker.random.boolean() : opts.moreCopies
  opts.excludeFromJudging = opts.excludeFromJudging === undefined ? faker.random.boolean() : opts.excludeFromJudging
  return Show.create({
    name: opts.name,
    description: opts.description,
    entryCap: opts.entryCap,
    entryStart: opts.entryStart,
    entryEnd: opts.entryEnd,
    judgingStart: opts.judgingStart,
    judgingEnd: opts.judgingEnd,
    moreCopies: opts.moreCopies,
    excludeFromJudging: opts.excludeFromJudging
  })
}

function fakeImage (opts) {
  opts.path = opts.path || faker.system.commonFileName('.jpg')
  opts.horizDimInch = opts.horizDimInch || faker.random.number({min: 1, max: 100})
  opts.vertDimInch = opts.vertDimInch || faker.random.number({min: 1, max: 100})
  opts.mediaType = opts.mediaType || faker.lorem.word()
  return Image.create({
    path: opts.path,
    horizDimInch: opts.horizDimInch,
    vertDimInch: opts.vertDimInch,
    mediaType: opts.mediaType
  })
}

function fakeEntry (opts) {
  opts = opts || {}
  if (!opts.image && !opts.video && !opts.other) {
    throw Error('No entry item found')
  }
  opts.title = opts.title || faker.lorem.words(3)
  opts.moreCopies = opts.moreCopies === undefined ? faker.random.boolean() : opts.moreCopies
  opts.comment = opts.comment || faker.lorem.sentence()
  opts.forSale = opts.forSale === undefined ? faker.random.boolean() : opts.forSale
  opts.invited = opts.invited === undefined ? faker.random.boolean() : opts.invited
  opts.awardWon = opts.awardWon || faker.lorem.words(2)
  opts.yearLevel = opts.yearLevel === undefined ? faker.lorem.word() : opts.yearLevel
  opts.academicProgram = opts.academicProgram === undefined ? faker.lorem.word() : opts.academicProgram
  const showPromise = opts.show ? Promise.resolve(opts.show) : fakeShow()
  const userPromise = opts.user || opts.group ? Promise.resolve(opts.user) : fakeUser()
  const entryType = opts.image ? IMAGE_ENTRY : opts.video ? VIDEO_ENTRY : OTHER_ENTRY
  const entryId = opts.image ? opts.image.id : opts.video ? opts.video.id : opts.other.id
  return Promise.all([showPromise, userPromise])
    .then((models) => {
      const show = models[0]
      const user = models[1]
      return Entry.create({
        showId: show.id,
        studentUsername: user ? user.username : null,
        groupId: opts.group ? opts.group.id : null,
        entryType: entryType,
        entryId: entryId,
        title: opts.title,
        comment: opts.comment,
        moreCopies: opts.moreCopies,
        forSale: opts.forSale,
        awardWon: opts.awardWon,
        invited: opts.invited
      })
    })
}

export function fakeImageEntry (opts) {
  opts = opts || {}
  const imagePromise = opts.image ? Promise.resolve(opts.image) : fakeImage(opts)
  return imagePromise
    .then((image) => {
      opts.image = image
      return fakeEntry(opts)
    })
}
