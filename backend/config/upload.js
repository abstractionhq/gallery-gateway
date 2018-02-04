export default {
  imageDir: process.env.NODE_ENV === 'test' ? './test/uploads/images' : './uploads/images',
  pdfDir: process.env.NODE_ENV === 'test' ? './test/uploads/pdfs' : './uploads/pdfs'
}
