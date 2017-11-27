import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'

import { feetchJudgesByAssignmentForShow } from '../actions'

import JudgesQuery from '../queries/judges.graphql'
import JudgesForShowQuery from '../queries/judgesForShow.graphql'

import AssignToShowMutation from '../mutations/assignToShow.graphql'
import RemoveFromShowMutation from '../mutations/removeFromShow.graphql'

import AssignJudgesTable from '../components/AssignJudgesTable'

const filterUnassignedJudges = (allJudges = [], assignedJudges = []) => {
  const assignedUsernames = mapAssignmentsToJudges(allJudges, assignedJudges).map(judge => judge.username)
  const unassignedJudges = Object.values(allJudges).filter(judge => !assignedUsernames.includes(judge.username))
  return unassignedJudges
}

const mapAssignmentsToJudges = (allJudges = [], assignedJudges = []) => {
  return assignedJudges.map(key => allJudges[key])
}

const mapStateToProps = (state, ownProps) => ({
  data: {
    unassignedJudges: filterUnassignedJudges(state.admin.judges, state.admin.assignments[ownProps.showId]),
    assignedJudges: mapAssignmentsToJudges(state.admin.judges, state.admin.assignments[ownProps.showId])
  }
})

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
