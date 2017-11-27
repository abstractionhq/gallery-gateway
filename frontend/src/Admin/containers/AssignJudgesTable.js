import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'

import { feetchJudgesByAssignmentForShow } from '../actions'

import JudgesQuery from '../queries/judges.graphql'
import JudgesForShowQuery from '../queries/judgesForShow.graphql'

import AssignToShowMutation from '../mutations/assignToShow.graphql'
import RemoveFromShowMutation from '../mutations/removeFromShow.graphql'

import AssignJudgesTable from '../components/AssignJudgesTable'

const filterUnassignedJudges = (judges, assignments = []) => {
  return Object.values(judges).filter(judge => !assignments.includes(judge.username))
}

const mapAssignmentsToJudges = (judges, assignments = []) => {
  return assignments.map(key => judges[key])
}

const mapStateToProps = (state, ownProps) => {
  const judges = state.admin.judges
  const assignments = state.admin.assignments[ownProps.showId]
  return {
    data: {
      unassignedJudges: filterUnassignedJudges(judges, assignments),
      assignedJudges: mapAssignmentsToJudges(judges, assignments)
    }
  }
}

const mapDispatchToProps = (dispatch, {showId}) => ({
  fetchData: () => dispatch(feetchJudgesByAssignmentForShow(showId))
})

const withRedux = connect(mapStateToProps, mapDispatchToProps)(AssignJudgesTable)

const withMutations = compose(
  graphql(AssignToShowMutation, {
    props: ({ownProps, mutate}) => ({
      assign: (usernames) => mutate({
        variables: {
          showId: ownProps.showId,
          usernames
        },
        update: (client, {data: assignToShow}) => {
          if (assignToShow) {
            const data = client.readQuery({
              query: JudgesForShowQuery,
              variables: {
                id: ownProps.showId
              }
            })

            console.log(data) // TODO: Finish. See: https://www.apollographql.com/docs/react/features/cache-updates.html#directAccess
          }
        }
      })
    })
  }),
  graphql(RemoveFromShowMutation, {
    props: ({ownProps, mutate}) => ({
      unassign: (usernames) => mutate({
        variables: {
          showId: ownProps.showId,
          usernames
        },
        update: (client, {data: removeFromShow}) => {
          if (removeFromShow) {
            const data = client.readQuery({
              query: JudgesForShowQuery,
              variables: {
                id: ownProps.showId
              }
            })

            console.log(data) // TODO: Finish. See: https://www.apollographql.com/docs/react/features/cache-updates.html#directAccess
          }
        }
      })
    })
  })
)(withRedux)

export default withMutations
