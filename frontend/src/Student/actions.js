import axios from 'axios'

import pdf from 'assets/pdf.svg'
import { IMAGE_UPLOAD_PATH, PDF_UPLOAD_PATH } from '../utils'
import { displayError } from '../shared/actions'

export const UPLOAD_IMAGE = 'UPLOAD_IMAGE'
export const UPLOAD_PDF = 'UPLOAD_PDF'
export const CLEAR_PREVIEW = 'CLEAR_PREVIEW'

export const uploadImage = file => (dispatch, getState, client) => {
  // Endpoint expects 'multipart/form-data' w/ key 'image'
  const formData = new FormData()
  formData.append('image', file)

  return axios
    .post(IMAGE_UPLOAD_PATH, formData, {
      headers: { Authorization: `Bearer ${getState().shared.auth.token}` }
    })
    .then(({ data }) =>
      dispatch({
        type: UPLOAD_IMAGE,
        payload: {
          path: data.path,
          name: file.name,
          preview: file.preview
        }
      })
    )
    .catch(err => {
      let message
      if (err.response.status === 413) {
        message = 'That file is too large. Files must be smaller than 50MB.'
      } else {
        message = err.message
      }

      dispatch(displayError(message))
    })
}

export const uploadPDF = file => (dispatch, getState, client) => {
  // Endpoint expects 'multipart/form-data' w/ key 'pdf'
  const formData = new FormData()
  formData.append('pdf', file)

  return axios
    .post(PDF_UPLOAD_PATH, formData, {
      headers: { Authorization: `Bearer ${getState().shared.auth.token}` }
    })
    .then(({ data }) =>
      dispatch({
        type: UPLOAD_PDF,
        payload: {
          path: data.path,
          name: file.name,
          preview: pdf
        }
      })
    )
    .catch(err => {
      let message
      if (err.response.status === 413) {
        message = 'That file is too large. Files must be smaller than 50MB.'
      } else {
        message = err.message
      }

      dispatch(displayError(message))
    })
}

export const clearPreview = () => (dispatch, getState, client) => {
  dispatch({
    type: CLEAR_PREVIEW
  })
}
