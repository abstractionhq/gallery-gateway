import { graphql } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { uploadImage, uploadPDF, clearPreview } from '../actions'
import { displayError, setUserHometown, setUserDisplayName} from '../../shared/actions'

import OtherMediaSubmissionForm from '../components/OtherMediaSubmissionForm'
import CreateOtherMediaEntry from '../mutations/createOtherMediaEntry.graphql'
import ShowForSubmission from '../queries/showForSubmission.graphql'

const mapStateToProps = state => ({
  previewFile: state.student.ui.submission.previewFile || {},
  user: state.shared.auth.user
})

const mapDispatchToProps = dispatch => ({
  done: () => dispatch(push('/')),
  handlePDFUpload: file => dispatch(uploadPDF(file)),
  handleImageUpload: file => dispatch(uploadImage(file)),
  handleHometown: hometown => dispatch(setUserHometown(hometown)),
  handleDisplayName: displayName => dispatch(setUserDisplayName(displayName)),
  clearPreview: () => dispatch(clearPreview()),
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(CreateOtherMediaEntry, {
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
)(OtherMediaSubmissionForm)
