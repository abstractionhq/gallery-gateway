import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { fetchVote } from '../actions'
import VotePanel from '../components/VotePanel'
import SendVote from '../mutations/sendVote.graphql'

const mapStateToProps = state => ({
  user: state.shared.auth.user
})

const mapDispatchToProps = dispatch => ({
  fetchVote: submissionId => dispatch(fetchVote(submissionId))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(SendVote, {
    props: ({ mutate, ownProps }) => ({
      makeVote: value =>
        mutate({
          variables: {
            input: {
              judgeUsername: ownProps.user.username,
              entryId: ownProps.submission.id,
              value
            }
          }
        }).then(() => ownProps.fetchVote(ownProps.submission.id))
    })
  })
)(VotePanel)
