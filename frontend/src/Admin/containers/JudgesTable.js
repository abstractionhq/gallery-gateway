import { graphql } from 'react-apollo'

import JudgesQuery from '../queries/judges.graphql'
import JudgesTable from '../components/JudgesTable'

export default graphql(JudgesQuery, {
  props: ({data: { users, loading }}) => ({
    judges: users,
    loading
  })
})(JudgesTable)
