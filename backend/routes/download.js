import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import { Router } from 'express'
import JSZip from 'jszip'
import stringify from 'csv-stringify'

import Entry from '../models/entry'
import Group from '../models/group'
import Image from '../models/image'
import Video from '../models/video'
import OtherMedia from '../models/other'
import Show from '../models/show'
import User from '../models/user'
import { IMAGE_ENTRY, VIDEO_ENTRY, OTHER_ENTRY, ADMIN } from '../constants'
import config from '../config'
import sequelize from '../config/sequelize'
import { parseToken } from '../helpers/jwt'

const readFileAsync = promisify(fs.readFile)

const IMAGE_DIR = config.get('upload:imageDir')

const router = Router()

const ensureAdminDownloadToken = (req, res, next) => {
  const token = req.query.token
  parseToken(token, (err, decoded) => {
    if (err || decoded.type !== ADMIN) {
      res.status(401)
        .type('html')
        .send('permission denied')
    } else {
      next()
    }
  })
}

router.route('/csv/:showId')
  .get(ensureAdminDownloadToken, (req, res, next) => {
    // find the show
    Show.findById(req.params.showId, { rejectOnEmpty: true })
      .then(show => {
        // find all image Entries to this show id
        Entry.findAll({
          where: { showId: req.params.showId },
          attributes: { exclude: ['createdAt', 'updatedAt'] }
        })
          .then(entries => {
            // Get the additonal information on the entries by getting
            // all the ids and then making the call, to reduce calls to the db
            const imageIds = []
            const videoIds = []
            const otherMediaIds = []
            entries.forEach((entry) => {
              if (entry.entryType === IMAGE_ENTRY) {
                imageIds.push(entry.entryId)
              } else if (entry.entryType === VIDEO_ENTRY) {
                videoIds.push(entry.entryId)
              } else if (entry.entryType === OTHER_ENTRY) {
                otherMediaIds.push(entry.entryId)
              }
            })

            return Promise.all([Image.findAll({ where: { id: { $in: imageIds } } }),
              Video.findAll({ where: { id: { $in: videoIds } } }), OtherMedia.findAll({ where: { id: { $in: otherMediaIds } } })
            ]).then(([images, videos, otherMedia]) => {
              // Create a mapping for type objects to their ids for easy assigning
              const imageIdsToImage = images.reduce((obj, image) => ({
                ...obj,
                [image.id]: image
              }), {})
              const videoIdsToImage = videos.reduce((obj, video) => ({
                ...obj,
                [video.id]: video
              }), {})
              const otherMediaIdsToImage = otherMedia.reduce((obj, other) => ({
                ...obj,
                [other.id]: other
              }), {})

              // create update entry objects that contain modified entry data plus:
              // path, vert and horiz dementions medaiType, provider, videoId
              const entriesWithTypeData = entries.map(entry => {
                let entryData = entry.dataValues
                let entryType = entry.entryType === IMAGE_ENTRY ? 'Image'
                  : entry.entryType === VIDEO_ENTRY ? 'Video'
                    : entry.entryType === OTHER_ENTRY ? 'OtherMedia' : ''
                let newEntry = {
                  studentEmail: `${entryData.studentUsername}@rit.edu`,
                  isGroupSubmission: entryData.groupId ? true : null,
                  entryType: entryType,
                  title: entryData.title,
                  comment: entryData.comment,
                  moreCopies: entryData.moreCopies,
                  forSale: entryData.forSale,
                  awardWon: entryData.awardWon,
                  invited: entryData.invited,
                  yearLevel: entryData.yearLevel,
                  academicProgram: entryData.academicProgram,
                  excludeFromJudging: entryData.excludeFromJudging,
                  path: '',
                  horizDimInch: '',
                  vertDimInch: '',
                  mediaType: '',
                  provider: '',
                  videoId: ''
                }

                // Add entry data to data object
                if (entry.entryType === IMAGE_ENTRY) {
                  let imageObj = imageIdsToImage[entry.entryId]
                  return {
                    ...newEntry,
                    path: imageObj.path,
                    horizDimInch: imageObj.horizDimInch,
                    vertDimInch: imageObj.vertDimInch,
                    mediaType: imageObj.mediaType
                  }
                } else if (entry.entryType === VIDEO_ENTRY) {
                  let videoObj = videoIdsToImage[entry.entryId]
                  return {
                    ...newEntry,
                    provider: videoObj.provider,
                    videoId: videoObj.videoId
                  }
                } else if (entry.entryType === OTHER_ENTRY) {
                  let otherObj = otherMediaIdsToImage[entry.entryId]
                  return {
                    ...newEntry,
                    path: otherObj.path
                  }
                }
              })
              // Send csv data to browser
              stringify(entriesWithTypeData, { header: true }, (err, output) => {
                if (err) {
                  console.error(err)
                  res.status(500).send('500: Oops! Try again later.')
                }
                res.status(200)
                  .type('text/csv')
                  .attachment(`${show.name}.csv`)
                  .send(output)
              })
            })
          })
      })
  })
router.route('/zips/:showId')
  .get(ensureAdminDownloadToken, (req, res, next) => {
    // find the show
    Show.findById(req.params.showId, { rejectOnEmpty: true })
      .then(show => {
        // find all image Entries to this show id
        Entry.findAll({ where: { showId: req.params.showId, entryType: IMAGE_ENTRY } })
          .then(entries => {
            // Look up all Images for these Entries to add the 'path' attribute to
            // all entry objects.
            // Params:
            //   entries: [Entry]
            // Evaluates to:
            //   [Entry]

            const imageIds = entries.map((entry) => entry.entryId)
            return Image.findAll({ where: { id: { $in: imageIds } } })
              .then(images => {
                // create a mapping of imageId -> image for easy assigning
                // Evaluates to: [Entry]
                const imageIdsToImage = images.reduce((obj, image) => ({
                  ...obj,
                  [image.id]: image
                }), {})

                // assign 'path' to all entries
                entries.forEach(entry => {
                  entry.path = imageIdsToImage[entry.entryId].path
                })
                return entries
              })
          })
          .then(entries => {
            // Now we need to group images by who is submitting, to later enforce
            // unique file names (despite non-unique titles for submissions, i.e.
            // Untitled)
            // Params:
            //   entries: [Entry] with the `path` attribute set
            // Evaluates to:
            //   {
            //     studentSubmissions: {
            //       xxx1233: [entry, ...],
            //       ...
            //     },
            //     groupSubmissions: {
            //       4: [entry, ...],
            //       ...
            //     }
            //   }

            // maps usernames to their entries
            // example:
            // {
            //   xxx1234: [entry, ...]
            // }
            const studentSubmissions = entries
              .filter(entry => entry.isStudentSubmission())
              .reduce((accum, elem) => ({
                ...accum,
                [elem.studentUsername]: [...(accum[elem.studentUsername] || []), elem]
              }), {})

            // maps group ids to their entries
            // example:
            // {
            //   4: [entry, ...]
            // }
            const groupSubmissions = entries
              .filter(entry => entry.isGroupSubmission())
              .reduce((accum, elem) => ({
                ...accum,
                [elem.groupId]: [...(accum[elem.groupId] || []), elem]
              }), {})

            return {
              studentSubmissions,
              groupSubmissions
            }
          })
          .then(({ studentSubmissions, groupSubmissions }) => {
            // We need to query for the User and Group objects that go with each
            // of the following usernames or group IDs, so we know their names
            // Params:
            //   {
            //     studentSubmissions: {
            //       xxx1233: [entry, ...],
            //       ...
            //     },
            //     groupSubmissions: {
            //       4: [entry, ...],
            //       ...
            //     }
            //   }
            // Evaluates to:
            //   [
            //     {
            //       user: User,
            //       entries: [...]
            //     },
            //     {
            //       group: User,
            //       entries: [...]
            //     },
            //     ...
            //   ]

            return Promise.all([
              User.findAll({ where: { username: { $in: Object.keys(studentSubmissions) } } }),
              Group.findAll({ where: { id: { $in: Object.keys(groupSubmissions) } } })
            ])
              .then(([users, groups]) => {
                // construct a username -> User mapping
                // {
                //   "xxx1234": User,
                //   ...
                // }
                const usernamesToUsers = users.reduce((obj, user) => ({
                  ...obj,
                  [user.username]: user
                }), {})

                // construct a groupId -> Group mapping
                // {
                //   4: Group,
                //   ...
                // }
                const groupIdsToGroups = groups.reduce((obj, group) => ({
                  ...obj,
                  [group.id]: group
                }), {})

                // [
                //   {
                //     user: User,
                //     entries: [entry, ...]
                //   },
                //   ...
                // ]
                const submissionsWithUsers = Object
                  .entries(studentSubmissions)
                  .map(([username, entries]) => ({
                    user: usernamesToUsers[username],
                    entries
                  }))

                // [
                //   {
                //     group: Group,
                //     entries: [entry, ...]
                //   },
                //   ...
                // ]
                const submissionsWithGroups = Object
                  .entries(groupSubmissions)
                  .map(([groupId, entries]) => ({
                    group: groupIdsToGroups[groupId],
                    entries
                  }))

                return [...submissionsWithUsers, ...submissionsWithGroups]
              })
          })
          .then(submissionsWithSubmitters => {
            // now we construct the calculated title for each entry
            // Evaluates to:
            // [
            //   {
            //     name: 'Last First - title.jpg',
            //     path: 'path/to/image.jpg',
            //     invited: true
            //   }
            // ]
            const namesSeen = new Set()
            return submissionsWithSubmitters.reduce((arr, { user, group, entries }) => {
              // ['Clark Kent - Daily Planet Office']
              const newSubmissionSummaries = entries.map(({ path, title, invited }) => {
                const entryNamePrefix = (
                  (user ? `${user.lastName} ${user.firstName}` : group.name) +
                  ' - ' +
                  title
                )
                // enforce non-conflicting titles by adding (1), (2), ... to end of name
                let proposedName = entryNamePrefix
                let i = 1
                while (namesSeen.has(proposedName)) {
                  // while we've seen this name before, increment and append a number
                  proposedName = `${entryNamePrefix} (${i})`
                  i += 1
                }
                namesSeen.add(proposedName)
                return {
                  name: `${proposedName}.jpg`,
                  path,
                  invited
                }
              })
              return [...arr, ...newSubmissionSummaries]
            }, [])
          })
          .then(entrySummaries => {
            // Now we need to generate the zip file...
            // entrySummaries:
            // [
            //   {
            //     name: 'First Last Title.jpg',
            //     path: 'path/to/image.jpg',
            //     invited: true
            //   },
            //   ...
            // ]
            const zip = new JSZip()
            entrySummaries.forEach((summary) => {
              zip.file(
                (summary.invited ? 'invited' : 'not invited') + '/' + summary.name,
                readFileAsync(path.join(IMAGE_DIR, summary.path))
              )
            })

            res.status(200)
              .type('zip')
              .attachment(`${show.name}.zip`)

            zip.generateNodeStream().pipe(res)
          })
      })
      .catch(sequelize.EmptyResultError, () => {
        res.status(404).send('404: Show not found')
      })
      .catch(err => {
        console.error(err)
        res.status(500).send('500: Oops! Try again later.')
      })
  })

export default router
