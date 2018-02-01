var imageDirPath
var pdfDirPath

if (process.env.NODE_ENV === 'test'){
    imageDirPath = './test/uploads/images'
    pdfDirPath = './test/uploads/pdfs'
  } else {
    imageDirPath = './uploads/images'
    pdfDirPath = './uploads/pdfs'
  }

  export default {
      imageDir: imageDirPath,
      pdfDir: pdfDirPath
  }