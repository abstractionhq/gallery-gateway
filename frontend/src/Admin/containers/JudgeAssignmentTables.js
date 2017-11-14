import { graphql } from 'react-apollo'

import JudgesQuery from '../queries/judges.graphql'
import AssignToShowMutation from '../mutations/assignToShow.graphql'
import UnassignToShowMutation from '../mutations/unassignToShow.graphql'
import JudgeAssignmentTables from '../components/JudgeAssignmentTables'

const withQuery = graphql(JudgesQuery, {
  props: ({data: { assigned, unassigned, loading }}) => ({
    assigned,
    unassigned,
    loading
  })
})(JudgeAssignmentTables)

const withAssignMutation = graphql(AssignToShowMutation, {
  props: ({ mutate }) => ({
    assign: (showId, usernames) => mutate({
      variables: { showId, usernames }
    })
  }),
  options: () => ({
    refetchQueries: [
      {
        query: JudgesQuery
      }
    ]
  })
})(withQuery)

const withUnassignMutation = graphql(UnassignToShowMutation, {
  props: ({ mutate }) => ({
    unassign: (showId, usernames) => mutate({
      variables: { showId, usernames }
    })
  }),
  options: () => ({
    refetchQueries: [
      {
        query: JudgesQuery
      }
    ]
  })
})(withAssignMutation)

export default withUnassignMutation
