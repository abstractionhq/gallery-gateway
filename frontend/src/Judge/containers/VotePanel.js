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
          },
          update: (cache) => {
            // Invalidates the 'score' attribute for this submission
            const dataId = `${ownProps.submission.__typename}:${ownProps.submission.id}`
            cache.data.set(dataId, {
              ...cache.data.get(dataId),
              score: undefined
            })
          }
        }).then(() => ownProps.fetchVote(ownProps.submission.id))
    })
  })
)(VotePanel)
