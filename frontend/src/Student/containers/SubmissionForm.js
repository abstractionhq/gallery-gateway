import { graphql } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

import { uploadImage } from '../actions'

import SubmissionForm from '../components/SubmissionForm'

const mapStateToProps = (state) => ({
  previewImage: state.student.ui.submission.previewImage || {}
})

const mapDispatchToProps = (dispatch) => ({
  handleUpload: (file) => dispatch(uploadImage(file))
})

const withRedux = connect(mapStateToProps, mapDispatchToProps)(SubmissionForm)

export default withRedux
