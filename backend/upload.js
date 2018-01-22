import multer from 'multer'
import mkdirp from 'mkdirp'
import uuidv1 from 'uuid/v1'

const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './images') // TODO: See if we want a ./year/images
  },
  filename: (req, file, callback) => {
    // Generate a unique id for the file
    const filename = uuidv1()
    // Make sure the correct directories exist or are created
    mkdirp.sync(`./images/${filename[0]}/${filename[1]}`)
    // Return the path for the file
    callback(null, `${filename[0]}/${filename[1]}/${filename}.jpg`) // TODO: Validation on file type
  }
})
const upload = multer({
  storage: Storage,
  limits: {fileSize: 50000000, files: 1}, // Max 50 MB
  fileFilter: fileTypeFilter
}).single('image') // Form field key needs to be 'image' w/ image data as the value

function fileTypeFilter (req, file, cb) {
  if (file.mimetype !== 'image/jpeg') {
    return cb(null, false);
   }
   cb(null, true);
}

export default function uploader (req, res) {
  upload(req, res, (err) => {
    if (err) {
      if(err.message === 'File too large'){
        return res.status(413).json({error: 'File too large'})
      }
      return res.status(500).json({error: 'Failed to Upload'})
    }

    if (!req.file) {
      return res.status(400).json({error: 'No JPEG Provided'})
    }

    return res.status(201).json({path: req.file.filename})
  })
}
