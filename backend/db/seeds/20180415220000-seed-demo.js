import https from 'https'
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import sharp from 'sharp'
import moment from 'moment'

const imageUploadDir = 'uploads/images'
const pdfUploadDir = 'uploads/pdfs'

const FISH_JPG = 'https://farm8.staticflickr.com/7257/7054549621_002ec9afe0_o_d.jpg' // flickr url broke :( 'https://farm8.staticflickr.com/5486/14501540216_73728d8fa9_o_d.jpg'
const TREE_JPG = 'https://farm8.staticflickr.com/7257/7054549621_002ec9afe0_o_d.jpg'
const BOOK_JPG = 'https://farm8.staticflickr.com/8722/16184844574_77a3143176_o_d.jpg'
const APPLES_JPG = 'https://farm8.staticflickr.com/1255/1172163196_aedc6863ef_o_d.jpg'
const RUNNING_JPG = 'https://farm8.staticflickr.com/2113/32950307196_ebc0a1c660_o_d.jpg'
const PURPLE_THING_JPG = 'https://farm8.staticflickr.com/3020/2687783841_ff4846cf1f_o_d.jpg'
const BOOK_COVER_JPG = 'https://farm8.staticflickr.com/2916/14124533308_ce540f0e73_o_d.jpg'
const SAMPLE_PDF = 'https://www.adobe.com/support/products/enterprise/knowledgecenter/media/c4611_sample_explain.pdf'

const genThumbnail = (fpath) => {
  // copy+pasted from routes/upload.js
  //
  const image = sharp(fpath)
  return image
    .metadata()
    .then(({height, width}) => {
      // Generate a thumnail with max width of 400px and max height of 300px

      let targetWidth = 0
      let targetHeight = 0
      // If the item is portrait-oriented, constrain the height and scale the
      // width proportionally
      if (height > width) {
        targetHeight = Math.min(300, height)
        targetWidth = Math.floor(targetHeight / height * width)
      } else {
        // Otherwise, the item is landscape-oriented, constrain the width and
        // scale the height proportionally
        targetWidth = Math.min(400, width)
        targetHeight = Math.floor(targetWidth / width * height)
      }
      // The thumbnail path is 'a/1/<guid>_thumb.jpg', for example
      const parsedFileName = path.parse(fpath)
      const thumbnailPath = `${parsedFileName.dir}/${parsedFileName.name}_thumb${parsedFileName.ext}`
      return image
        .resize(targetWidth, targetHeight)
        // Use progressive loading for super-quick low-quality image preview
        .jpeg({progressive: true})
        .toFile(thumbnailPath)
    })
}

const genId = () => Math.floor(Math.random() * 9000 + 1000)

const download = (url, destGuid, extn) => {
  // http downloading adapted from https://stackoverflow.com/q/11944932
  const dstDir = `${extn === 'jpg' ? imageUploadDir : pdfUploadDir}/${destGuid[0]}/${destGuid[1]}`
  const dst = `${dstDir}/${destGuid}.${extn}`
  return new Promise((resolve, reject) => {
    mkdirp(
      dstDir,
      (err) => {
        if (err) {
          reject(err)
          return
        }
        const fpipe = fs.createWriteStream(dst)
        https.get(url, (response) => {
          console.log('status', response.statusCode)
          if (response.statusCode === 500) {
            return setTimeout(
              () => resolve(download(url, destGuid, extn)),
              1000
            )
          }
          response.pipe(fpipe)
          fpipe.on('finish', () => {
            fpipe.close((err) => {
              if (err) {
                reject(err)
              } else if (extn === 'jpg') {
                // Remember to gen thumbs
                resolve(genThumbnail(dst))
              } else {
                resolve()
              }
            })
          })
        }).on('error', (err) => {
          fs.unlink(dst, () => reject(err))
        }).end()
      }
    )
  }).then(() => {
    console.log(`Downloaded ${url}`)
  })
}

export function up (queryInterface, Sequelize) {
  return Promise.all([
    download(FISH_JPG, '5864ff80-2d22-4fb6-a1d5-d2c537f4317a', 'jpg'),
    download(TREE_JPG, 'c7091aea-9d34-49ad-a7cd-311fd93dce83', 'jpg'),
    download(BOOK_JPG, 'e25d9093-d3da-4b2c-ae39-17520114d8d1', 'jpg'),
    download(APPLES_JPG, 'db98604f-9a2f-4339-907c-a1901dcfe058', 'jpg'),
    download(RUNNING_JPG, '4f566242-d504-491e-bab7-509f3ceea5e6', 'jpg'),
    download(PURPLE_THING_JPG, '8ab1c0b4-3733-49be-8d2e-a364f19165f6', 'jpg'),
    download(BOOK_COVER_JPG, '2f8e972e-1bae-41a2-b90b-fd4532f2268a', 'jpg'),
    download(SAMPLE_PDF, '1a5a1357-44bb-4d6e-9d5b-9c727be776fa', 'pdf')
  ])
    .then(() => {
      // create a show that's in judging
      const showId = genId()
      const now = moment()
      return queryInterface.bulkInsert('shows', [
        {
          id: showId,
          name: 'Demo Show (In Judging)',
          description: '',
          entryCap: 2,
          entryStart: moment().subtract(3 * 7, 'days').format('YYYY-MM-DD HH:mm:ss'),
          entryEnd: moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'),
          judgingStart: moment().subtract(6, 'days').format('YYYY-MM-DD HH:mm:ss'),
          judgingEnd: moment().add(1, 'weeks').format('YYYY-MM-DD HH:mm:ss'),
          finalized: 0,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        }
      ]).then(() => ({showId}))
    })
    .then(ids => {
      // add all the images
      const now = moment()
      const fishImageId = genId()
      const treeImageId = genId()
      const bookImageId = genId()
      const applesImageId = genId()
      const runningImageId = genId()
      const purpleThingImageId = genId()
      return queryInterface.bulkInsert('images', [
        {
          id: fishImageId,
          path: '5/8/5864ff80-2d22-4fb6-a1d5-d2c537f4317a.jpg',
          horizDimInch: 20,
          vertDimInch: 11,
          mediaType: 'Chromogenic Print',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: treeImageId,
          path: 'c/7/c7091aea-9d34-49ad-a7cd-311fd93dce83.jpg',
          horizDimInch: 10,
          vertDimInch: 8,
          mediaType: 'Chromogenic Print',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: bookImageId,
          path: 'e/2/e25d9093-d3da-4b2c-ae39-17520114d8d1.jpg',
          horizDimInch: 20,
          vertDimInch: 31,
          mediaType: 'Inkjet Print',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: applesImageId,
          path: 'd/b/db98604f-9a2f-4339-907c-a1901dcfe058.jpg',
          horizDimInch: 8.5,
          vertDimInch: 11,
          mediaType: 'Chromogenic Print',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: runningImageId,
          path: '4/f/4f566242-d504-491e-bab7-509f3ceea5e6.jpg',
          horizDimInch: 21,
          vertDimInch: 24,
          mediaType: 'Inkjet Print',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: purpleThingImageId,
          path: '8/a/8ab1c0b4-3733-49be-8d2e-a364f19165f6.jpg',
          horizDimInch: 21,
          vertDimInch: 25,
          mediaType: 'Chromogenic Print',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        }
      ]).then(() => ({
        ...ids,
        fishImageId,
        treeImageId,
        bookImageId,
        applesImageId,
        runningImageId,
        purpleThingImageId
      }))
    })
    .then(ids => {
      // add a vimeo and youtube entry
      const vimeoVideoId = genId()
      const youtubeVideoId = genId()
      const now = moment()
      return queryInterface.bulkInsert('videos', [
        {
          id: vimeoVideoId,
          provider: 'vimeo',
          videoId: '256674898',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: youtubeVideoId,
          provider: 'youtube',
          videoId: '2MpUj-Aua48',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        }
      ]).then(() => ({
        ...ids,
        vimeoVideoId,
        youtubeVideoId
      }))
    })
    .then(ids => {
      // add an image-other and a pdf-other
      const imageOtherId = genId()
      const pdfOtherId = genId()
      const now = moment()
      return queryInterface.bulkInsert('others', [
        {
          id: imageOtherId,
          path: '2/f/2f8e972e-1bae-41a2-b90b-fd4532f2268a.jpg',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: pdfOtherId,
          path: '1/a/1a5a1357-44bb-4d6e-9d5b-9c727be776fa.pdf',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        }
      ]).then(() => ({
        ...ids,
        imageOtherId,
        pdfOtherId
      }))
    })
    .then(ids => {
      const {showId, fishImageId, treeImageId} = ids
      // make user 7 submit the fish and the tree and the hanging book
      const fishEntryId = genId()
      const treeEntryId = genId()
      const now = moment()
      return queryInterface.bulkInsert('entries', [
        {
          id: fishEntryId,
          showId,
          studentUsername: 'user7',
          entryType: 1,
          entryId: fishImageId,
          title: 'Betta In Bloom',
          comment: '',
          moreCopies: 1,
          forSale: 1,
          yearLevel: 'five',
          academicProgram: 'Ceramics',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: treeEntryId,
          showId,
          studentUsername: 'user7',
          entryType: 1,
          entryId: treeImageId,
          title: 'Tree in the Field',
          comment: '',
          moreCopies: 1,
          forSale: 0,
          yearLevel: 'five',
          academicProgram: 'Ceramics',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        }
      ]).then(() => ({
        ...ids,
        fishEntryId,
        treeEntryId
      }))
    })
    .then(ids => {
      // user 6 submits hanging book and vimeo video
      const { showId, bookImageId, vimeoVideoId } = ids
      const hangingBookEntryId = genId()
      const vimeoVideoEntryId = genId()
      const now = moment()
      return queryInterface.bulkInsert('entries', [
        {
          id: vimeoVideoEntryId,
          showId,
          studentUsername: 'user6',
          entryType: 2,
          entryId: vimeoVideoId,
          title: 'Mountain Biking',
          comment: '',
          moreCopies: 1,
          forSale: 0,
          yearLevel: 'four',
          academicProgram: 'Industrial Design',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: hangingBookEntryId,
          showId,
          studentUsername: 'user6',
          entryType: 1,
          entryId: bookImageId,
          title: 'Cloudy Mind and Lofty Goals',
          comment: '',
          moreCopies: 1,
          forSale: 0,
          yearLevel: 'four',
          academicProgram: 'Industrial Design',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        }
      ]).then(() => ({
        ...ids,
        hangingBookEntryId,
        vimeoVideoEntryId
      }))
    })
    .then(ids => {
      // User 8 submits the sample PDF and the purple thing
      const { showId, purpleThingImageId, pdfOtherId } = ids
      const purpleThingEntryId = genId()
      const pdfEntryId = genId()
      const now = moment()
      return queryInterface.bulkInsert('entries', [
        {
          id: purpleThingEntryId,
          showId,
          studentUsername: 'user8',
          entryType: 1,
          entryId: purpleThingImageId,
          title: 'Purple Saturday',
          comment: '',
          moreCopies: 1,
          forSale: 0,
          yearLevel: 'third',
          academicProgram: 'Graphic Design',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: pdfEntryId,
          showId,
          studentUsername: 'user8',
          entryType: 3,
          entryId: pdfOtherId,
          title: 'The Adventures of Souper Manne',
          comment: '',
          moreCopies: 1,
          forSale: 0,
          yearLevel: 'third',
          academicProgram: 'Graphic Design',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        }
      ]).then(() => ({
        ...ids,
        purpleThingEntryId,
        pdfEntryId
      }))
    })
    .then(ids => {
      const group1Id = genId()
      const group2Id = genId()
      const now = moment()
      return queryInterface.bulkInsert('groups', [
        {
          id: group1Id,
          participants: 'John Renner, Michael Timbrook',
          creatorUsername: 'user8',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: group2Id,
          participants: 'Bob Ross, Carl Sagan',
          creatorUsername: 'user6',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        }
      ]).then(() => ({
        ...ids,
        group1Id,
        group2Id
      }))
    })
    .then(ids => {
      // group 1 submits the youtube video
      // group 2 submits the 'other' image
      const { showId, group1Id, group2Id, youtubeVideoId, imageOtherId } = ids
      const youtubeEntryId = genId()
      const otherImageEntryId = genId()
      const now = moment()
      return queryInterface.bulkInsert('entries', [
        {
          id: youtubeEntryId,
          showId,
          studentUsername: 'user8',
          groupId: group1Id,
          entryType: 2,
          entryId: youtubeVideoId,
          title: 'Bees?',
          comment: '',
          moreCopies: 0,
          forSale: 0,
          yearLevel: 'third',
          academicProgram: 'Graphic Design',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          id: otherImageEntryId,
          showId,
          studentUsername: 'user6',
          groupId: group2Id,
          entryType: 3,
          entryId: imageOtherId,
          title: 'Exploratory Binding No. 1',
          comment: '',
          moreCopies: 1,
          forSale: 1,
          yearLevel: 'third',
          academicProgram: 'Graphic Design',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        }
      ]).then(() => ({
        ...ids,
        youtubeEntryId,
        otherImageEntryId
      }))
    })
    .then(ids => {
      // assign all judges to the show
      const { showId } = ids
      const now = moment()
      return queryInterface.bulkInsert('user_shows', [
        {
          username: 'user2',
          showId,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          username: 'user3',
          showId,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          username: 'user4',
          showId,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          username: 'user5',
          showId,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        }
      ]).then(() => ids)
    })
    .then(ids => {
      // Have judges vote on things
      const {
        fishEntryId,
        hangingBookEntryId,
        purpleThingEntryId,
        treeEntryId,
        otherImageEntryId,
        pdfEntryId,
        vimeoVideoEntryId,
        youtubeEntryId
      } = ids
      const now = moment()
      return queryInterface.bulkInsert('votes', [
        {
          judgeUsername: 'user2',
          entryId: fishEntryId,
          value: 2,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          judgeUsername: 'user2',
          entryId: hangingBookEntryId,
          value: 1,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          judgeUsername: 'user2',
          entryId: purpleThingEntryId,
          value: 0,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          judgeUsername: 'user2',
          entryId: treeEntryId,
          value: 0,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          judgeUsername: 'user2',
          entryId: otherImageEntryId,
          value: 2,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          judgeUsername: 'user2',
          entryId: pdfEntryId,
          value: 0,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          judgeUsername: 'user2',
          entryId: vimeoVideoEntryId,
          value: 2,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          judgeUsername: 'user2',
          entryId: youtubeEntryId,
          value: 0,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          judgeUsername: 'user3',
          entryId: fishEntryId,
          value: 1,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          judgeUsername: 'user3',
          entryId: hangingBookEntryId,
          value: 0,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          judgeUsername: 'user3',
          entryId: purpleThingEntryId,
          value: 2,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          judgeUsername: 'user3',
          entryId: treeEntryId,
          value: 1,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          judgeUsername: 'user4',
          entryId: otherImageEntryId,
          value: 0,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          judgeUsername: 'user4',
          entryId: pdfEntryId,
          value: 2,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          judgeUsername: 'user4',
          entryId: vimeoVideoEntryId,
          value: 1,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          judgeUsername: 'user4',
          entryId: youtubeEntryId,
          value: 1,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          judgeUsername: 'user5',
          entryId: vimeoVideoEntryId,
          value: 0,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        }
      ]).then(() => ids)
    })
    .then(ids => {
      const oldShowId = genId()
      const now = moment()
      return queryInterface.bulkInsert('shows', [
        {
          id: oldShowId,
          name: 'Demo Show (Completed)',
          description: '',
          entryCap: 2,
          entryStart: moment().subtract(10, 'weeks').format('YYYY-MM-DD HH:mm:ss'),
          entryEnd: moment().subtract(9, 'weeks').format('YYYY-MM-DD HH:mm:ss'),
          judgingStart: moment().subtract(9, 'weeks').format('YYYY-MM-DD HH:mm:ss'),
          judgingEnd: moment().subtract(8, 'weeks').format('YYYY-MM-DD HH:mm:ss'),
          finalized: 1,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        }
      ]).then(() => ({
        ...ids,
        oldShowId
      }))
    })
    .then(ids => {
      // Make user8 have one invited and one not invited old submission
      const {oldShowId, runningImageId, applesImageId} = ids
      const now = moment()
      return queryInterface.bulkInsert('entries', [
        {
          showId: oldShowId,
          studentUsername: 'user8',
          entryType: 1,
          entryId: runningImageId,
          title: 'Runaway Stone',
          comment: '',
          moreCopies: 1,
          forSale: 0,
          yearLevel: 'third',
          invited: 1,
          academicProgram: 'Graphic Design',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        },
        {
          showId: oldShowId,
          studentUsername: 'user8',
          entryType: 1,
          entryId: applesImageId,
          title: 'Harvest',
          comment: '',
          moreCopies: 1,
          forSale: 0,
          yearLevel: 'third',
          invited: 0,
          academicProgram: 'Graphic Design',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        }
      ]).then(() => ids)
    })
}

export function down (queryInterface) {
  console.log('cannot undo')
}
