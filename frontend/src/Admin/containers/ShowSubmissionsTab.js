import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import ShowSubmissionsTab from '../components/ShowSubmissionsTab'
import UpdateInvitation from '../mutations/updateInvitation.graphql'
import FinalizeShowInvites from '../mutations/finalizeShowInvites.graphql'

export default compose(
  graphql(UpdateInvitation, {
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
    props: ({ mutate, ownProps }) => ({
      finalizeInvites: () =>
        mutate({
          variables: {
            id: ownProps.show.id,
            input: {
              finalized: true
            }
          }
        })
    })
  })
)(ShowSubmissionsTab)
