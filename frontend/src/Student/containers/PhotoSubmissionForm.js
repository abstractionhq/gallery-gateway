import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

import { uploadImage, clearPreview } from '../actions'

import PhotoSubmissionForm from '../components/PhotoSubmissionForm'
import CreatePhotoEntry from '../mutations/createPhotoEntry.graphql'
import ShowName from '../queries/showName.graphql'

const mapStateToProps = (state, ownProps) => ({
  previewImage: state.student.ui.submission.previewFile || {},
  user: state.shared.auth.user
})

const mapDispatchToProps = (dispatch) => ({
  done: () => dispatch(push('/')),
  handleUpload: (file) => dispatch(uploadImage(file)),
  clearPreview: () => dispatch(clearPreview())
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
  }),
  graphql(ShowName, {
    options: ( ownProps ) => ({
      variables: {
        id: ownProps.id
      }
    })
  })
)(withRedux)

export default withMutations
