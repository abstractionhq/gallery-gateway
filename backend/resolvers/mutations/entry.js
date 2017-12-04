import { UserError } from 'graphql-errors'
import Entry from '../../models/entry'
import Image from '../../models/image'
import Video from '../../models/video'
import { ADMIN, IMAGE_ENTRY } from '../../constants'

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
    throw new UserError('Video url not valid')
  }
  return Video.create({
    provider: type,
    videoId: id
  }).then((video) => {
    return Entry.create({
      ...args.input.entry,
      entryType: IMAGE_ENTRY,
      entryId: video.id
    })
  })
}

function allowedToSubmit (args, req) {
  // TODO update the below to account for group submission rights
  return req.auth.username !== undefined && req.auth.username === args.input.entry.studentUsername
}

function parseVideo (url) {
  url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(&\S+)?/)
  let type
  if (RegExp.$3.indexOf('youtu') > -1) {
    type = 'youtube'
  } else if (RegExp.$3.indexOf('vimeo') > -1) {
    type = 'vimeo'
  }
  return { type: type, id: RegExp.$6 }
}
