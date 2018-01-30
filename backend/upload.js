import multer from 'multer'
import mkdirp from 'mkdirp'
import uuidv1 from 'uuid/v1'
import nconf from './config'

const image_dir = nconf.get('upload:imageDir')
const pdf_dir = nconf.get('upload:pdfDir')

function storage(dir, extn){
  return multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, dir) // TODO: See if we want a ./year/images
    },
    filename: (req, file, callback) => {
      // Generate a unique id for the file
      const filename = uuidv1()
      // Make sure the correct directories exist or are created
      mkdirp.sync(`${dir}/${filename[0]}/${filename[1]}`)
      // Return the path for the file
      callback(null, `${filename[0]}/${filename[1]}/${filename}.${extn}`)
    }
  })
}

const imageUpload = multer({
  storage: storage(image_dir, 'jpg'),
  limits: {fileSize: 50000000, files: 1}, // Max 50 MB
  fileFilter: imageTypeFilter
}).single('image') // Form field key needs to be 'image' w/ image data as the value

const pdfUpload = multer({
  storage: storage(pdf_dir, 'pdf'),
  limits: {fileSize: 50000000, files: 1}, // TODO: Figure out max pdf size
  fileFilter: pdfTypeFilter
}).single('pdf') // Form field key needs to be 'pdf' w/ pdf data as the value

function imageTypeFilter (req, file, cb, mimetype) {
  if (file.mimetype !== 'image/jpeg') { // verify image is a jpg
    return cb(null, false);
   }
   cb(null, true);
}

function pdfTypeFilter (req, file, cb, mimetype) {
  if (file.mimetype !== 'application/pdf') { // verify image is a jpg
    return cb(null, false);
   }
   cb(null, true);
}

function handleRes(req, res, err, fileType){
  if (err) {
    if(err.message === 'File too large'){
      return res.status(413).json({error: 'File too large'})
    }
    return res.status(500).json({error: 'Failed to Upload'})
  }

  if (!req.file) {
    return res.status(400).json({error: `No ${fileType} Provided`})
  }

  return res.status(201).json({path: req.file.filename})
}



export function imageUploader (req, res) {
  imageUpload(req, res, (err) => {
    return handleRes(req, res, err, 'JPEG')
  })
}

export function  pdfUploader(req, res) {
  pdfUpload(req, res, (err) => {
    return handleRes(req, res, err, 'PDF')
  })
}
