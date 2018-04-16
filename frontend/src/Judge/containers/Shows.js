import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import ShowsQuery from '../queries/assignedShows.graphql'
import Shows from '../components/Shows'

export default compose(
  graphql(ShowsQuery, {
    options: () => ({ variables: { date: Date.now() } }),
    props: ({ data: { self, loading } }) => ({
      user: self,
      loading
    })
  })
)(Shows)
