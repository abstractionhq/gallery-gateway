import { graphql } from 'react-apollo'

import ShowsQuery from '../queries/shows.graphql'
import Shows from '../components/Shows'

export default graphql(ShowsQuery, {
  props: ({data: { shows, loading }}) => ({
    shows,
    loading
  })
})(Shows)
