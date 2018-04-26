import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import ShowsQuery from '../queries/assignedShows.graphql'
import Shows from '../components/Shows'
import { displayError } from '../../shared/actions'

const mapDispatchToProps = dispatch => ({
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(null, mapDispatchToProps),
  graphql(ShowsQuery, {
    options: () => ({ variables: { date: Date.now() } }),
    props: ({ data: { self, loading, error } }) => ({
      user: self,
      loading,
      error
    })
  })
)(Shows)
