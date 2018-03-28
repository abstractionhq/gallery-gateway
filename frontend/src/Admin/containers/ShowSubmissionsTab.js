import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { fetchVote } from '../actions'
import ShowSubmissionsTab from '../components/ShowSubmissionsTab'
import InviteToShow from '../mutations/inviteToShow.graphql'

const mapDispatchToProps = dispatch => ({
  fetchSubmission: submissionId => dispatch(fetchSubmission(submissionId))
})

export default compose(
  connect(null, mapDispatchToProps),
  graphql(InviteToShow, {
    props: ({ mutate, ownProps }) => ({
      updateInvite: value =>
        mutate({
          variables: {
            id: ownProps.submission.id,
            input: {
              invited: value
            }
          }
        }).then(() => ownProps.fetchSubmission(ownProps.submission.id))
    })
  })
)(ShowSubmissionsTab)
