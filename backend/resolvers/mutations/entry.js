import { UserError } from 'graphql-errors'
import Entry from '../../models/entry'
import Image from '../../models/image'
import { ADMIN, IMAGE_ENTRY } from '../../constants'

export function createPhoto (_, args, req) {
  // TODO update the below to account for group submission rights
  const submittingOwnWork = req.auth.username !== undefined && req.auth.username === args.input.entry.studentUsername
  if (req.auth.type !== ADMIN && !submittingOwnWork) {
    // don't allow non-admins to submit work claiming to be from someone else
    throw new UserError('Permission Denied')
  }
  return Image.create({
    path: args.input.path,
    horizDimInch: args.input.horizDimInch,
    vertDimInch: args.input.vertDimInch,
    mediaType: args.input.mediaType
  }).then((image) => {
    return Entry.create({
      ...args.input.entry,
      entryType: IMAGE_ENTRY,
      entryId: image.id
    }).then((entry) => Object.assign(entry, image.dataValues))
  })
}
