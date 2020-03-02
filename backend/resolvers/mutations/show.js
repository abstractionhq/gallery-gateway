import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import config from '../../config'
import db from '../../config/sequelize'
import Show from '../../models/show'
import Vote from '../../models/vote'
import Entry from '../../models/entry'
import Image from '../../models/image'
import Video from '../../models/video'
import Other from '../../models/other'
import { UserError } from 'graphql-errors'
import moment from 'moment-timezone'
import { ADMIN, IMAGE_ENTRY, OTHER_ENTRY, VIDEO_ENTRY } from '../../constants'
import SinglePiece from '../../models/singlePiece'

const imageDir = config.get('upload:imageDir')
const pdfDir = config.get('upload:pdfDir')
const unlink = promisify(fs.unlink)

export function createShow (_, args, req) {
  if (req.auth.type !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  // Handle timezones, start times to midnight and end times to 11:59:59
  const entryStart = moment(args.input.entryStart).tz('America/New_York').startOf('day')
  const entryEnd = moment(args.input.entryEnd).tz('America/New_York').endOf('day')
  const judgingStart = moment(args.input.judgingStart).tz('America/New_York').startOf('day')
  const judgingEnd = moment(args.input.judgingEnd).tz('America/New_York').endOf('day')
  const newShow = {
    name: args.input.name,
    description: args.input.description,
    entryStart: entryStart,
    entryEnd: entryEnd,
    judgingStart: judgingStart,
    judgingEnd: judgingEnd,
    entryCap: args.input.entryCap
  }
  return Show.create(newShow)
}

export function updateShow (_, args, req) {
  // Only admins can update entries
  if (req.auth.type !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  return Show.findById(args.id)
    .then((show) => {
      return show.update(args.input, {
        fields: ['name', 'description',
          'entryStart', 'entryEnd',
          'judgingStart', 'judgingEnd',
          'entryCap', 'finalized']
      })
    })
}

export function deleteShow (_, args, req) {
  // Only admins can delete shows
  if (req.auth.type !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  return db.transaction(transaction =>
    Show.findById(args.id, {transaction})
      .then(show => {
        if (!show) {
          // If the show doesn't exist, then no need to delete anything
          return Promise.resolve(true)
        }
        // Otherwise, get all the entries with attachments so we can delete their files   
        return Entry.findAll({where: {showId: args.id}, transaction})
          .then(entries => {
            // Collect IDs of the specific entry-types through singlePieces
            // console.log(args.id)
            // console.log(entries)
            const singlePieceIds = entries.map(e => e.pieceId)
            // console.log(singlePieceIds)
            return SinglePiece.findAll({where: { id: {$in: singlePieceIds}}, transaction}).then(singlePieces => {
              const imageIds = singlePieces
                .filter(e => e.pieceType === IMAGE_ENTRY)
                .map(e => e.pieceId)
              const videoIds = singlePieces
                .filter(e => e.pieceType === VIDEO_ENTRY)
                .map(e => e.pieceId)
              const otherIds = singlePieces
                .filter(e => e.pieceType === OTHER_ENTRY)
                .map(e => e.pieceId)
              // Query the db to get their paths
              return Promise.all([
                Image.findAll({where: { id: {$in: imageIds} }, transaction}),
                Other.findAll({where: { id: {$in: otherIds} }, transaction})
              ])
                .then(([images, others]) => {
                  // Merge together the paths into one array
                  const pathStubs = [
                    ...images.map(i => i.path),
                    ...others.map(o => o.path)
                  ].filter(p => p !== null)
                  // Add all _thumb.jpg files
                  const withThumbs = pathStubs.reduce(
                    (arr, p) => {
                      if (p.endsWith('.jpg')) {
                        const parsed = path.parse(p)
                        return [
                          ...arr,
                          p,
                          `${parsed.dir}/${parsed.name}_thumb${parsed.ext}`
                        ]
                      } else {
                        // Not an image
                        return [...arr, p]
                      }
                    },
                    []
                  )
                  // Prepend the storage directory to the path stubs
                  const paths = withThumbs.map(path => {
                    if (path.endsWith('.pdf')) {
                      return `${pdfDir}/${path}`
                    }
                    if (path.endsWith('.jpg')) {
                      return `${imageDir}/${path}`
                    }
                    throw new Error(`unknown extension for path: ${path}`)
                  })
                  // Delete everything
                  const unlinkPromises = paths.map(path => unlink(path))
                  return Promise.all(unlinkPromises)
                })
                .then(() => Promise.all([
                  // Remove all entry specifics, because they don't cascade
                  Image.destroy({where: {id: {$in: imageIds}}, transaction}),
                  Video.destroy({where: {id: {$in: videoIds}}, transaction}),
                  Other.destroy({where: {id: {$in: otherIds}}, transaction}),
                  SinglePiece.destroy({where: {id: {$in: singlePieceIds}}, transaction})
                ]))
            })
          })
          .then(() => 
            show.destroy({where: {id: args.id}})
          )
      })
  )
}

export function assignToShow (_, args, req) {
  if (req.auth.type !== ADMIN) {
    throw new UserError('Permission Denied')
  }
  return Show.findOne({ where: { id: args.showId } }).then((show) => {
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
  if (args.usernames.length < 1) {
    throw new UserError('Please input one or more usernames')
  }
  return db.transaction(transaction =>
    Show.findOne({ where: { id: args.showId }, transaction })
      .then((show) => {
        if (show === null) {
          throw new UserError('Show Not Found')
        }

        return show.removeUsers(args.usernames, {transaction})
      })
      .then(() => Entry.findAll({where: {showId: args.showId}, transaction}))
      .then(entries => {
        const entryIds = entries.map(entry => entry.id)
        return Vote.destroy({where: {entryId: entryIds, judgeUsername: args.usernames}, transaction})
      })
  ).then(() => { return true })
}
