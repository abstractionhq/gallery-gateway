import { graphql } from 'react-apollo'

import ShowsQuery from '../queries/assignedShows.graphql'
import Shows from '../components/Shows'

export default graphql(ShowsQuery, {
  options: () => ({ variables: { date: Date.now() } }),
  props: ({ data: { self, loading } }) => ({
    user: self,
    loading
  })
})(Shows)
