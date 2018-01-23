var imageDirPath
if (process.env.NODE_ENV === 'test'){
    imageDirPath = './test/images'
  } else {
    imageDirPath = './images'
  }

  export default {
      imageDir: imageDirPath
  }