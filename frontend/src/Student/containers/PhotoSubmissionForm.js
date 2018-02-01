import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

import { uploadImage } from '../actions'

import PhotoSubmissionForm from '../components/PhotoSubmissionForm'
import CreatePhotoEntry from '../mutations/createPhotoEntry.graphql'

const mapStateToProps = (state) => ({
  previewImage: state.student.ui.submission.previewImage || {},
  user: state.shared.auth.user
})

const mapDispatchToProps = (dispatch) => ({
  done: () => dispatch(push('/')),
  handleUpload: (file) => dispatch(uploadImage(file))
  // TODO: Removing an image -> you upload, but change your mind; put a 'x' on the top right corner
})

const withRedux = connect(mapStateToProps, mapDispatchToProps)(PhotoSubmissionForm)

const withMutations = compose(
  graphql(CreatePhotoEntry, {
    props: ({mutate}) => ({
      create: (entry) => mutate({
        variables: { input: entry }
      })
    })
  })
)(withRedux)

export default withMutations
