import multer from 'multer'
import guid from 'guid'

const Storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './images') // TODO: See if we want a ./year/images
  },
  filename: (req, file, callback) => {
    let filename = guid.raw
    callback(null, `${filename[0]}/${filename[1]}/${filename}.jpg`)
  }
})

const upload = multer({
  storage: Storage,
  limits: {fileSize: 50000000, files: 1} // Max 50 MB
})

export default function uploader (req, res) {
  return upload(req, res, (err) => {
    console.log(err)
    return res.json({message: 'Failed to upload'})
  }).then(() => {
    return res.json({path: req.file.filename})
  })
}
