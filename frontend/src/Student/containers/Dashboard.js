import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

// import ShowsQuery from '../queries/shows.graphql'
import Shows from '../components/Shows'

export default graphql(ShowsQuery, {
  props: ({data: { shows, loading }}) => ({
    shows,
    loading
  })
})(Shows)
