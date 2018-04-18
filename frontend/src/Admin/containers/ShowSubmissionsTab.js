import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { displayError } from '../../shared/actions'

import ShowSubmissionsTab from '../components/ShowSubmissionsTab'
import UpdateInvitation from '../mutations/updateInvitation.graphql'
import FinalizeShowInvites from '../mutations/finalizeShowInvites.graphql'

const mapDispatchToProps = (dispatch, { showId }) => ({
  handleError: (message) => dispatch(displayError(message))
})

export default compose(
  connect(null, mapDispatchToProps),
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
