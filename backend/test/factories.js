import faker from 'faker'
import User from '../models/user'
import { STUDENT } from '../permissionLevels'

/**
 * Fake a User
 * @param {object} opts - optional, details about the user
 * @param {string} opts.type - type of user, default STUDENT
 * @param {string} opts.username - username, default faked
 * @return {Promise<User>} the user that was made
 */
export function fakeUser(opts) {
  opts = opts || {};
  opts.type = opts.type || STUDENT;
  opts.username = opts.username || faker.internet.userName();
  return User.create({
    username: opts.username,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    type: opts.type
  })
}