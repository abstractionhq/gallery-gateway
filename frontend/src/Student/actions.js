import axios from 'axios'

import pdf from 'assets/pdf.svg'

export const UPLOAD_IMAGE = 'UPLOAD_IMAGE'
export const UPLOAD_PDF = 'UPLOAD_PDF'

export const uploadImage = (file) => (dispatch, getState, client) => {
  // Endpoint expects 'multipart/form-data' w/ key 'image'
  const formData = new FormData()
  formData.append('image', file)

  return axios.post('http://localhost:3000/static/upload/image', formData) // TODO: Extract URL
    .then(({data}) => dispatch({
      type: UPLOAD_IMAGE,
      payload: {
        path: data.path,
        name: file.name,
        preview: file.preview
      }
    }))
    .catch(console.error) // TODO: Handle the error
}

export const uploadPDF = (file) => (dispatch, getState, client) => {
  // Endpoint expects 'multipart/form-data' w/ key 'pdf'
  const formData = new FormData()
  formData.append('pdf', file)

  return axios.post('http://localhost:3000/static/upload/pdf', formData) // TODO: Extract URL
    .then(({data}) => dispatch({
      type: UPLOAD_PDF,
      payload: {
        path: data.path,
        name: file.name,
        preview: pdf
      }
    }))
    .catch(console.error) // TODO: Handle the error
}
