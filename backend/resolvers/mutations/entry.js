import { UserError } from 'graphql-errors'
import Entry from '../../models/entry'
import Image from '../../models/image'
import Video from '../../models/video'
import { ADMIN, IMAGE_ENTRY } from '../../constants'
import { allowedToSubmit, parseVideo } from '../../helpers/submission'

export function createPhoto (_, args, req) {
  if (req.auth.type !== ADMIN && !allowedToSubmit(args, req)) {
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

export function createVideo (_, args, req) {
  if (req.auth.type !== ADMIN && !allowedToSubmit(args, req)) {
    // don't allow non-admins to submit work claiming to be from someone else
    throw new UserError('Permission Denied')
  }
  const { type, id } = parseVideo(args.input.url)
  if (!type || !id) {
    throw new UserError('The video URL must be a valid URL from Youtube or Vimeo')
  }
  return Video.create({
    provider: type,
    videoId: id
  }).then((video) => {
    return Entry.create({
      ...args.input.entry,
      entryType: IMAGE_ENTRY,
      entryId: video.id
    }).then((entry) => Object.assign(entry, video.dataValues))
  })
}
