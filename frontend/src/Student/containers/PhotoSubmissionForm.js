import { graphql } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { uploadImage, clearPreview } from '../actions'
import { displayError, setUserHometown, setUserDisplayName} from '../../shared/actions'

import PhotoSubmissionForm from '../components/PhotoSubmissionForm'
import CreatePhotoEntry from '../mutations/createPhotoEntry.graphql'
import ShowForSubmission from '../queries/showForSubmission.graphql'

const mapStateToProps = state => ({
  previewImage: state.student.ui.submission.previewFile || {},
  user: state.shared.auth.user
})

const mapDispatchToProps = dispatch => ({
  done: () => dispatch(push('/')),
  handleUpload: file => dispatch(uploadImage(file)),
  handleHometown: hometown => dispatch(setUserHometown(hometown)),
  handleDisplayName: displayName => dispatch(setUserDisplayName(displayName)),
  clearPreview: () => dispatch(clearPreview()),
  handleError: message => dispatch(displayError(message))
  // TODO: Removing an image -> you upload, but change your mind; put a 'x' on the top right corner
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(CreatePhotoEntry, {
    props: ({ mutate }) => ({
      create: entry =>
        mutate({
          variables: { input: entry }
        })
    })
  }),
  graphql(ShowForSubmission, {
    options: ownProps => ({
      variables: {
        id: ownProps.id
      }
    })
  })
)(PhotoSubmissionForm)
