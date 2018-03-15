import { graphql } from 'react-apollo'

import VotePanel from '../components/VotePanel'
import SendVote from '../mutations/sendVote.graphql'

const makeVote = compose(
  graphql(SendVote, {
    props: ({ mutate }) => ({
      vote: (input) => mutate({variables: {input}})
    })
  })
)(VotePanel)

export default makeVote
