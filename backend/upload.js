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
  limits: {fileSize: 50000000, files: 1} // Max 50 MB
}).single('image') // Form field key needs to be 'image' w/ image data as the value

export default function uploader (req, res) {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({error: 'Failed to Upload'})
    }

    if (!req.file) {
      return res.status(400).json({error: 'No File Provided'})
    }

    return res.json({path: req.file.filename})
  })
}
