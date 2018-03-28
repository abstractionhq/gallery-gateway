import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import ShowQuery from '../queries/show.graphql'
import ShowSubmissionsTab from '../components/ShowSubmissionsTab'
import InviteToShow from '../mutations/inviteToShow.graphql'

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
    }),
    options: () => ({
      refetchQueries: [
        {
          query: ShowQuery
        }
      ]
    })
  })
)(ShowSubmissionsTab)
