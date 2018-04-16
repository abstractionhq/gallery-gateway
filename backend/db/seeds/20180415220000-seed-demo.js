import https from 'https'
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import sharp from 'sharp'
import moment from 'moment'

const imageUploadDir = 'uploads/images'
const pdfUploadDir = 'uploads/pdfs'

const FISH_JPG = 'https://farm6.staticflickr.com/5486/14501540216_73728d8fa9_o_d.jpg'
const TREE_JPG = 'https://farm8.staticflickr.com/7257/7054549621_002ec9afe0_o_d.jpg'
const BOOK_JPG = 'https://farm9.staticflickr.com/8722/16184844574_77a3143176_o_d.jpg'
const APPLES_JPG = 'https://farm2.staticflickr.com/1255/1172163196_aedc6863ef_o_d.jpg'
const RUNNING_JPG = 'https://farm3.staticflickr.com/2113/32950307196_ebc0a1c660_o_d.jpg'
const PURPLE_THING_JPG = 'https://farm4.staticflickr.com/3020/2687783841_ff4846cf1f_o_d.jpg'
const BOOK_COVER_JPG = 'https://farm3.staticflickr.com/2916/14124533308_ce540f0e73_o_d.jpg'
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
          response.pipe(fpipe)
          fpipe.on('finish', () => {
            fpipe.close(() => {
              if (extn === 'jpg') {
                // Remember to gen thumbs
                resolve(genThumbnail(dst))
              } else {
                resolve()
              }
            })
          })
        }).on('error', (err) => {
          fs.unlink(dst)
          reject(err)
        })
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
      const showId = Math.floor(Math.random() * 900 + 100)
      const now = moment()
      return queryInterface.bulkInsert('shows', [
        {
          id: showId,
          name: 'Demo Show (In Judging)',
          description: '',
          entryCap: 3,
          entryStart: now.subtract(3, 'weeks').format('YYYY-MM-DD HH:mm:ss'),
          entryEnd: now.subtract(1, 'weeks').format('YYYY-MM-DD HH:mm:ss'),
          judgingStart: now.subtract(1, 'weeks').format('YYYY-MM-DD HH:mm:ss'),
          judgingEnd: now.add(1, 'weeks').format('YYYY-MM-DD HH:mm:ss'),
          finalized: 0,
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        }
      ]).then(() => ({showId}))
    })
    .then(ids => {
      // add all the images
      const now = moment()
      const fishImageId = Math.floor(Math.random() * 900 + 100)
      const treeImageId = Math.floor(Math.random() * 900 + 100)
      const bookImageId = Math.floor(Math.random() * 900 + 100)
      const applesImageId = Math.floor(Math.random() * 900 + 100)
      const runningImageId = Math.floor(Math.random() * 900 + 100)
      const purpleThingImageId = Math.floor(Math.random() * 900 + 100)
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
      const vimeoVideoId = Math.floor(Math.random() * 900 + 100)
      const youtubeVideoId = Math.floor(Math.random() * 900 + 100)
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
      const imageOtherId = Math.floor(Math.random() * 900 + 100)
      const pdfOtherId = Math.floor(Math.random() * 900 + 100)
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
    .then(({showId, fishImageId, treeImageId, bookImageId, ...ids}) => {
      // make user 7 submit the fish and the tree and the hanging book
      const fishEntryId = Math.floor(Math.random() * 900 + 100)
      const treeEntryId = Math.floor(Math.random() * 900 + 100)
      const hangingBookEntryId = Math.floor(Math.random() * 900 + 100)
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
        },
        {
          id: hangingBookEntryId,
          showId,
          studentUsername: 'user7',
          entryType: 1,
          entryId: bookImageId,
          title: 'Rainfall in Paper',
          comment: '',
          moreCopies: 0,
          forSale: 0,
          yearLevel: 'five',
          academicProgram: 'Ceramics',
          createdAt: now.format('YYYY-MM-DD HH:mm:ss'),
          updatedAt: now.format('YYYY-MM-DD HH:mm:ss')
        }
      ]).then(() => ({
        ...ids,
        showId,
        fishEntryId,
        treeEntryId,
        hangingBookEntryId
      }))
    })
}

export function down (queryInterface) {
  console.log('cannot undo')
}
