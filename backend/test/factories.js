import faker from 'faker'
import User from '../models/user'
import Show from '../models/show'
import { STUDENT } from '../permissionLevels'

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
  return Show.create({
    name: opts.name,
    description: opts.description,
    entryCap: opts.entryCap,
    entryStart: opts.entryStart,
    entryEnd: opts.entryEnd,
    judgingStart: opts.judgingStart,
    judgingEnd: opts.judgingEnd
  })
}
