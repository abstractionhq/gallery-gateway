import { graphql } from 'react-apollo'

import JudgesQuery from '../queries/judges.graphql'
import JudgesForShowQuery from '../queries/judgesForShow.graphql'
import AssignToShowMutation from '../mutations/assignToShow.graphql'
import UnassignToShowMutation from '../mutations/unassignToShow.graphql'
import JudgeAssignmentTables from '../components/JudgeAssignmentTables'

const withJudgesQuery = graphql(JudgesQuery, {
  props: ({data: { judges, loading, error }}) => ({
    judges,
    loading,
    error
  })
})(JudgeAssignmentTables)

const withAssignedJudgesQuery = graphql(JudgesForShowQuery, {
  props: ({data: { judges, loading, error }}) => ({
    assigned: judges,
    loading,
    error
  }),
  options: (ownProps) => ({
    variables: {
      id: ownProps.params.id
    }
  })
})(withJudgesQuery)

const withAssignMutation = graphql(AssignToShowMutation, {
  props: (ownProps, { mutate }) => ({
    assign: (usernames) => mutate({
      variables: { showId: ownProps.params.id, usernames }
    })
  }),
  options: () => ({
    refetchQueries: [
      {
        query: JudgesQuery
      }
    ]
  })
})(withAssignedJudgesQuery)

const withUnassignMutation = graphql(UnassignToShowMutation, {
  props: (ownProps, { mutate }) => ({
    unassign: (usernames) => mutate({
      variables: { showId: ownProps.params.id, usernames }
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
