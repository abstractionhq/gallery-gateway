import { graphql, compose } from 'react-apollo'
import { connect } from 'react-redux'

import { feetchJudgesByAssignmentForShow } from '../actions'

import JudgesQuery from '../queries/judges.graphql'
import JudgesForShowQuery from '../queries/judgesForShow.graphql'

import AssignToShowMutation from '../mutations/assignToShow.graphql'
import RemoveFromShowMutation from '../mutations/removeFromShow.graphql'

import JudgeAssignmentTables from '../components/JudgeAssignmentTables'

const mapStateToProps = ({Admin}) => ({
  data: {
    unassignedJudges: Admin.unassignedJudges || [], // TODO: Change the store hierarchy?
    assignedJudges: Admin.assignedJudges || []
  }
})

const mapDispatchToProps = (dispatch, {showId}) => ({
  fetchData: () => dispatch(feetchJudgesByAssignmentForShow(showId))
})

const withRedux = connect(mapStateToProps, mapDispatchToProps)(JudgeAssignmentTables)

const withMutations = compose(
  graphql(AssignToShowMutation, {
    props: ({ownProps, mutate}) => ({
      assign: (usernames) => mutate({
        variables: {
          showId: ownProps.showId,
          usernames
        }
      })
    })
  }),
  graphql(RemoveFromShowMutation, {
    props: ({ownProps, mutate}) => ({
      unassign: (usernames) => mutate({
        variables: {showId: ownProps.showId, usernames}
      })
    })
  })
)(withRedux)

export default withMutations
