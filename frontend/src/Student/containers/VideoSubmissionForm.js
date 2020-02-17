import { graphql } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { displayError, setUserHometown, setUserDisplayName} from '../../shared/actions'

import VideoSubmissionForm from '../components/VideoSubmissionForm'
import CreateVideoEntry from '../mutations/createVideoEntry.graphql'
import ShowForSubmission from '../queries/showForSubmission.graphql'

const mapStateToProps = state => ({
  user: state.shared.auth.user
})

const mapDispatchToProps = dispatch => ({
  done: () => dispatch(push('/')),
  handleHometown: hometown => dispatch(setUserHometown(hometown)),
  handleDisplayName: displayName => dispatch(setUserDisplayName(displayName)),
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(CreateVideoEntry, {
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
)(VideoSubmissionForm)
