import db from '../../config/sequelize'

import { UserError } from 'graphql-errors'
import Entry from '../../models/entry'
import Image from '../../models/image'
import Video from '../../models/video'
import Other from '../../models/other'
import Group from '../../models/group'
import Show from '../../models/show'
import { ADMIN, IMAGE_ENTRY, OTHER_ENTRY, VIDEO_ENTRY } from '../../constants'
import { allowedToSubmit, parseVideo } from '../../helpers/submission'

// Creates an Entry based on the 'EntryInput' schema
const createEntry = (entry, entryType, entryId, t) => {
  // if this entry is to a group, construct one
  let groupPromise = Promise.resolve(null)
  if (entry.group) {
    groupPromise = Group.create({
      name: entry.group.name,
      creatorUsername: entry.group.creatorUsername,
      participants: entry.group.participants
    }, { transaction: t })
  }
  return groupPromise
    .then(group => {
      // We now have access to a Group instance (from attributes above).
      // The only thing left to do is create the Entry object, which is (mostly)
      // described by the `entry` parameter. We must first remove its `group`
      // property and replace it with the group's ID, since our orm recognizes
      // groupId, not a Group

      // clone the object
      let newEntry = Object.assign({}, entry)
      // remove the 'group' property
      delete newEntry['group']
      // create the new Entry with select properties filled-in
      return Entry.create({
        ...newEntry,
        entryType: entryType,
        entryId: entryId,
        groupId: group ? group.id : null
      }, { transaction: t })
    })
}

// Rejects the promise if the supplied args indicate the student is doing a
// single (non-group) submission, but they have met their limit.
const canMakeMoreSingleEntries = (
  {
    input: {
      entry: {
        studentUsername = null,
        group = null,
        showId
      }
    }
  },
  t
) => {
  if (!studentUsername && !group) {
    return Promise.reject(new UserError('Entry must have an entrant'))
  }
  // if submitting as a group, ignore this check
  if (group && group.creatorUsername) {
    return Promise.resolve()
  }
  // find the entry cap for this show
  return Show.findById(showId, { transaction: t, rejectOnEmpty: true })
    .then(show =>
      Entry.count({ where: { showId, studentUsername } })
        .then(entries => {
          if (entries >= show.entryCap) {
            throw new UserError('Individual submission limit reached')
          } else {
            return Promise.resolve()
          }
        })
    )
}

export function updateEntry (_, args, req) {
  // Only admins can update entries
  if (req.auth.type !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  return Entry.findById(args.id)
    .then((entry) => {
      return entry.update(args.input)
        .then(() => { return args.id })
    })
}

export function createPhoto (_, args, req) {
  if (req.auth.type !== ADMIN && !allowedToSubmit(args, req)) {
    // don't allow non-admins to submit work claiming to be from someone else
    throw new UserError('Permission Denied')
  }
  return db.transaction(t =>
    canMakeMoreSingleEntries(args, t)
      .then(() =>
        Image.create({
          path: args.input.path,
          horizDimInch: args.input.horizDimInch,
          vertDimInch: args.input.vertDimInch,
          mediaType: args.input.mediaType
        }, { transaction: t })
          .then(image =>
            createEntry(args.input.entry, IMAGE_ENTRY, image.id, t)
          )
      )
  )
}

export function createVideo(_, args, req) {
  if (req.auth.type !== ADMIN && !allowedToSubmit(args, req)) {
    // don't allow non-admins to submit work claiming to be from someone else
    throw new UserError('Permission Denied')
  }
  const { type, id } = parseVideo(args.input.url)
  if (!type || !id) {
    throw new UserError('The video URL must be a valid URL from Youtube or Vimeo')
  }
  return db.transaction(t =>
    canMakeMoreSingleEntries(args, t)
      .then(() =>
        Video.create({
          provider: type,
          videoId: id
        }, { transaction: t })
          .then(video =>
            createEntry(args.input.entry, VIDEO_ENTRY, video.id, t)
          )
      )
  )
}

export function createOtherMedia(_, args, req) {
  if (req.auth.type !== ADMIN && !allowedToSubmit(args, req)) {
    // don't allow non-admins to submit work claiming to be from someone else
    throw new UserError('Permission Denied')
  }
  return db.transaction(t =>
    canMakeMoreSingleEntries(args, t)
      .then(() =>
        Other.create({
          path: args.input.path
        }, { transaction: t })
          .then(other =>
            createEntry(args.input.entry, OTHER_ENTRY, other.id, t)
          )
      )
  )
}
