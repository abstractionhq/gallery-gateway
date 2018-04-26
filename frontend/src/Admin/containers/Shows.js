import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import ShowsQuery from '../queries/shows.graphql'
import Shows from '../components/Shows'
import { displayError } from '../../shared/actions'

const mapDispatchToProps = dispatch => ({
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(null, mapDispatchToProps),
  graphql(ShowsQuery, {
    props: ({ ownProps, data: { shows, loading, error } }) => ({
      shows,
      loading,
      error
    })
  })
)(Shows)
