/* eslint-disable no-unused-expressions */

import multer from 'multer'
import mkdirp from 'mkdirp'
import uuidv4 from 'uuid/v4'
import sharp from 'sharp'
import path from 'path'
import nconf from '../config'
import { Router } from 'express'
import { ADMIN, STUDENT } from '../constants'

const router = Router()

const imageDir = nconf.get('upload:imageDir')
const pdfDir = nconf.get('upload:pdfDir')

// Enums, for designating what file type we are processing
const JPEG = 'JPEG'
const PDF = 'PDF'

function storage (dir, extn) {
  return multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, dir) // TODO: See if we want a ./year/images
    },
    filename: (req, file, callback) => {
      // Generate a unique id for the file
      const filename = uuidv4()
      // Make sure the correct directories exist or are created
      mkdirp.sync(`${dir}/${filename[0]}/${filename[1]}`)
      // Return the path for the file
      callback(null, `${filename[0]}/${filename[1]}/${filename}.${extn}`)
    }
  })
}

const imageUpload = multer({
  storage: storage(imageDir, 'jpg'),
  limits: { fileSize: 50000000, files: 1 }, // Max 50 MB
  fileFilter: imageTypeFilter
}).single('image') // Form field key needs to be 'image' w/ image data as the value

const pdfUpload = multer({
  storage: storage(pdfDir, 'pdf'),
  limits: { fileSize: 50000000, files: 1 }, // TODO: Figure out max pdf size
  fileFilter: pdfTypeFilter
}).single('pdf') // Form field key needs to be 'pdf' w/ pdf data as the value

function imageTypeFilter (req, file, cb, mimetype) {
  if (file.mimetype !== 'image/jpeg') { // verify image is a jpg
    return cb(null, false)
  }
  cb(null, true)
}

function pdfTypeFilter (req, file, cb, mimetype) {
  if (file.mimetype !== 'application/pdf') { // verify file is a pdf
    return cb(null, false)
  }
  cb(null, true)
}

function handleRes (req, res, err, fileType) {
  if (err) {
    if (err.message === 'File too large') {
      return res.status(413).json({ error: 'File too large' })
    }
    return res.status(500).json({ error: 'Failed to Upload' })
  }

  if (!req.file) {
    return res.status(400).json({ error: `No ${fileType} Provided` })
  }

  if (fileType === JPEG) {
    // Must generate thumbnails for JPEG images
    const image = sharp(req.file.path)
    image
      .metadata()
      .then(metadata => {
        // Generate a thumnail with max width of 400px and max height of 300px
        const targetWidth = Math.min(400, metadata.width)
        const targetHeight = Math.min(300, metadata.height)
        // The thumbnail path is 'a/1/<guid>_thumb.jpg', for example
        const parsedFileName = path.parse(req.file.path)
        const thumbnailPath = `${parsedFileName.dir}/${parsedFileName.name}_thumb${parsedFileName.ext}`
        return image
          .resize(targetWidth, targetHeight)
          // Use progressive loading for super-quick low-quality image preview
          .jpeg({progressive: true})
          .toFile(thumbnailPath)
          .then(() => {
            res.status(201).json({ path: req.file.filename })
          })
      })
      .catch((e) => {
        console.error('Error in generating image thumbnail', e)
        res.status(500).json({ error: 'Internal server error' })
      })
  } else {
    // This is a PDF; no additional processing necessary
    res.status(201).json({ path: req.file.filename })
  }
}

function uploadAuth (req, res, next) {
  const authType = req.auth.type
  if (authType !== ADMIN && authType !== STUDENT) {
    return res.status(401).send('Permission Denied')
  } else {
    next()
  }
}

// Routers
router.route('/static/upload/image')
  .post(
    uploadAuth,
    (req, res, next) => imageUpload(req, res, (err) => {
      return handleRes(req, res, err, JPEG)
    })
  )

router.route('/static/upload/pdf')
  .post(
    uploadAuth,
    (req, res, next) => pdfUpload(req, res, (err) => {
      return handleRes(req, res, err, PDF)
    })
  )

export default router
