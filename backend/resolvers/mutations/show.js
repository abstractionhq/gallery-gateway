import Show from '../../models/show'
import { UserError } from 'graphql-errors'
import { ADMIN } from '../../constants'

export function createShow (_, args, req) {
  if (req.auth.type !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  return Show.create(args.input)
}

export function updateShow (_, args, req) {
  // Only admins can update entries
  if (req.auth.type !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  return Show.findById(args.id)
    .then((show) => {
      return show.update(args.input)
    })
}

export function assignToShow (_, args, req) {
  if (req.auth.type !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  return Show.findOne({where: {id: args.showId}}).then((show) => {
    if (show === null) {
      throw new UserError('Show Not Found')
    }
    if (args.usernames.length < 1) {
      throw new UserError('Please input one or more usernames')
    }
    return show
      .addUsers(args.usernames)
      .catch(() => {
        throw new UserError('Cannot find one or more usernames')
      })
  }).then(() => { return true })
}

export function removeFromShow (_, args, req) {
  if (req.auth.type !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  return Show.findOne({where: {id: args.showId}}).then((show) => {
    if (show === null) {
      throw new UserError('Show Not Found')
    }
    if (args.usernames.length < 1) {
      throw new UserError('Please input one or more usernames')
    }
    return show
      .removeUsers(args.usernames)
  }).then(() => { return true })
}
