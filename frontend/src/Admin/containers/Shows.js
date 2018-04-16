import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import ShowsQuery from '../queries/shows.graphql'
import Shows from '../components/Shows'

export default compose(
  graphql(ShowsQuery, {
    props: ({ data: { shows, loading } }) => ({
      shows,
      loading
    })
  })
)(Shows)
