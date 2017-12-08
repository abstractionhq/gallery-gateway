import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

import { uploadImage } from '../actions'

import SubmissionForm from '../components/SubmissionForm'
import CreatePhotoEntry from '../mutations/createPhotoEntry.graphql'

const mapStateToProps = (state) => ({
  previewImage: state.student.ui.submission.previewImage || {}
})

const mapDispatchToProps = (dispatch) => ({
  done: () => dispatch(push('/student/')),
  handleUpload: (file) => dispatch(uploadImage(file))
})

const withRedux = connect(mapStateToProps, mapDispatchToProps)(SubmissionForm)

const withMutations = compose(
  graphql(CreatePhotoEntry, {
    props: ({mutate}) => ({
      create: (entry) => mutate({
        variables: { input: entry }
      })
    })
  })
  // TODO: Video and Physical Object Mutations
)(withRedux)

export default withMutations
