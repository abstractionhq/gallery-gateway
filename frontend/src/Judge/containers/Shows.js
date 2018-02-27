import { graphql } from 'react-apollo'

import ShowsQuery from '../queries/assignedShows.graphql'
import Shows from '../components/Shows'

export default graphql(ShowsQuery, {
  props: ({ data: { self, loading } }) => ({
    user: self,
    loading
  })
})(Shows)
