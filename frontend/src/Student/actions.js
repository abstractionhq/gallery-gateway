import axios from 'axios'

export const UPLOAD_IMAGE = 'UPLOAD_IMAGE'

export const uploadImage = (file) => (dispatch, getState, client) => {
  // Endpoint expects 'multipart/form-data' w/ key 'image'
  const formData = new FormData()
  formData.append('image', file)

  return axios.post('http://localhost:3000/static/upload', formData) // TODO: Extract URL
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
