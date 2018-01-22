import db from '../../config/sequelize'

import { UserError } from 'graphql-errors'
import Entry from '../../models/entry'
import Image from '../../models/image'
import Video from '../../models/video'
import Other from '../../models/other'
import { ADMIN, IMAGE_ENTRY, OTHER_ENTRY } from '../../constants'
import { allowedToSubmit, parseVideo } from '../../helpers/submission'

export function createPhoto (_, args, req) {
  if (req.auth.type !== ADMIN && !allowedToSubmit(args, req)) {
    // don't allow non-admins to submit work claiming to be from someone else
    throw new UserError('Permission Denied')
  }
  return db.transaction(t => {
    return Image.create({
      path: args.input.path,
      horizDimInch: args.input.horizDimInch,
      vertDimInch: args.input.vertDimInch,
      mediaType: args.input.mediaType
    }, {transaction: t})
      .then((image) => {
        return Entry.create({
          ...args.input.entry,
          entryType: IMAGE_ENTRY,
          entryId: image.id
        }, {transaction: t})
          .then((entry) => Object.assign(entry, image.dataValues))
      })
  })
}

export function createVideo (_, args, req) {
  if (req.auth.type !== ADMIN && !allowedToSubmit(args, req)) {
    // don't allow non-admins to submit work claiming to be from someone else
    throw new UserError('Permission Denied')
  }
  const { type, id } = parseVideo(args.input.url)
  if (!type || !id) {
    throw new UserError('The video URL must be a valid URL from Youtube or Vimeo')
  }
  return db.transaction(t => {
    return Video.create({
      provider: type,
      videoId: id
    }, {transaction: t})
      .then((video) => {
        return Entry.create({
          ...args.input.entry,
          entryType: IMAGE_ENTRY,
          entryId: video.id
        }, {transaction: t})
          .then((entry) => Object.assign(entry, video.dataValues))
      })
  })
}

export function createOtherMedia (_, args, req) {
  if (req.auth.type !== ADMIN && !allowedToSubmit(args, req)) {
    // don't allow non-admins to submit work claiming to be from someone else
    throw new UserError('Permission Denied')
  }
  return db.transaction(t => {
    return Other.create({
      path: args.input.path
    }, {transaction: t})
      .then((other) => {
        return Entry.create({
          ...args.input.entry,
          entryType: OTHER_ENTRY,
          entryId: other.id
        }, {transaction: t})
          .then((entry) => Object.assign(entry, other.dataValues))
      })
  })
}
