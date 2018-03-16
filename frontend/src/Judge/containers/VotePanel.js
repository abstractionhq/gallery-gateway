import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'

import VotePanel from '../components/VotePanel'
import SendVote from '../mutations/sendVote.graphql'
import GetVote from '../queries/entryVote.graphql'

const withMutations = compose(
  graphql(SendVote, {
    props: ({ mutate, ownProps }) => ({
      vote: (value) => mutate({
        variables: {
          input: {
            judgeUsername: ownProps.user.username,
            entryId: ownProps.entryId,
            value
          }
        }
      })
    })
  }),
  graphql(GetVote, {
    options: ownProps => ({
      variables: {
        entryId: ownProps.entryId,
        judgeUsername: ownProps.user.username
      }
    })
  })
)(VotePanel)

const mapStateToProps = state => ({
  user: state.shared.auth.user
})

const withRedux = connect(mapStateToProps, null)(withMutations)

export default withRedux
