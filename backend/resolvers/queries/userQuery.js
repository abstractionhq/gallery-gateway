import User from '../../models/user'
import { UserError } from 'graphql-errors'
import { STUDENT, ADMIN, JUDGE } from '../../permissionLevels'

export function user (_, args, req) {
  const isRequestingOwnUser = 'id' in req.auth && req.auth.id === args.id
  if (req.auth.type !== ADMIN && !isRequestingOwnUser) {
    throw new UserError('Permission Denied')
  }
  return User.findById(args.id)
}
export function users (_, args, req) {
  if (req.auth.type !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  if (args.type === STUDENT) {
    return User.findAll({
      where: {
        type: STUDENT
      }
    })
  } else if (args.type === JUDGE) {
    return User.findAll({
      where: {
        type: JUDGE
      }
    })
  } else if (args.type === ADMIN) {
    return User.findAll({
      where: {
        type: ADMIN
      }
    })
  } else {
    return User.findAll()
  }
}
