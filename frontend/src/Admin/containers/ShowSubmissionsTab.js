import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import ShowSubmissionsTab from '../components/ShowSubmissionsTab'
import InviteToShow from '../mutations/inviteToShow.graphql'
import FinalizeShowInvites from '../mutations/finalizeShowInvites.graphql'

export default compose(
  graphql(InviteToShow, {
    props: ({ mutate }) => ({
      updateInvite: (id, value) =>
        mutate({
          variables: {
            id: id,
            input: {
              invited: value
            }
          }
        })
    })
  }),
  graphql(FinalizeShowInvites, {
    props: ({ mutate }) => ({
      finalizeInvites: id =>
        mutate({
          variables: {
            id: id,
            input: {
              finalized: true
            }
          }
        })
    })
  })
)(ShowSubmissionsTab)
