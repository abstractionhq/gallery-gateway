import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

import { uploadImage, uploadPDF, clearPreview } from '../actions'

import OtherMediaSubmissionForm from '../components/OtherMediaSubmissionForm'
import CreateOtherMediaEntry from '../mutations/createOtherMediaEntry.graphql'

const mapStateToProps = state => ({
  previewFile: state.student.ui.submission.previewFile || {},
  user: state.shared.auth.user
})

const mapDispatchToProps = dispatch => ({
  done: () => dispatch(push('/')),
  handlePDFUpload: file => dispatch(uploadPDF(file)),
  handleImageUpload: file => dispatch(uploadImage(file)),
  clearPreview: () => dispatch(clearPreview())
})

const withRedux = connect(mapStateToProps, mapDispatchToProps)(
  OtherMediaSubmissionForm
)

const withMutations = compose(
  graphql(CreateOtherMediaEntry, {
    props: ({ mutate }) => ({
      create: entry =>
        mutate({
          variables: { input: entry }
        })
    })
  })
)(withRedux)

export default withMutations
