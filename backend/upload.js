import multer from 'multer'

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './images')
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '_' + Date.now() + '_' + file.originalname)
  }
})

var upload = multer({
  storage: Storage,
  limits: {fileSize: 1000000, files: 1} // Max 1 MB
})

export default function uploader (req, res) {
  upload(req, res, function (err) {
    if (err) {
      return res.end('Something went wrong!')
    }
    return res.end('File uploaded sucessfully!.')
  })
}
