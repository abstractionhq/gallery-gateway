import { graphql } from "react-apollo";
import { connect } from "react-redux";
import { compose } from "recompose";
import {
  fetchJudgesByAssignmentForPortfolioPeriod,
  assignJudgesToPortfolioPeriod,
  removeJudgesFromPortfolioPeriod
} from "../actions";
import { displayError } from "../../shared/actions";

import JudgesQuery from "../queries/judges.graphql";
import JudgesForPortfolioPeriodQuery from "../queries/judgesForPortfolioPeriod.graphql";

import AssignToPortfolioPeriodMutation from "../mutations/assignToPortfolioPeriod.graphql";
import RemoveFromPortfolioPeriodMutation from "../mutations/removeFromPortfolioPeriod.graphql";

import AssignJudgesTable from "../components/AssignJudgesTable";

const filterUnassignedJudges = (judges, assignments = []) => {
  return Object.values(judges).filter(
    judge => !assignments.includes(judge.username)
  );
};

const mapAssignmentsToJudges = (judges, assignments = []) => {
  return assignments.map(key => judges[key]);
};

const mapStateToProps = (state, ownProps) => {
  const judges = state.admin.judges;
  const assignments =
    state.admin.portfolioPeriodAssignments[ownProps.portfolioPeriodId];
  return {
    data: {
      unassignedJudges: filterUnassignedJudges(judges, assignments),
      assignedJudges: mapAssignmentsToJudges(judges, assignments)
    }
  };
};

const mapDispatchToProps = (dispatch, { portfolioPeriodId }) => ({
  fetchData: () =>
    dispatch(fetchJudgesByAssignmentForPortfolioPeriod(portfolioPeriodId)),
  afterAssign: usernames =>
    dispatch(assignJudgesToPortfolioPeriod(portfolioPeriodId, usernames)),
  afterUnassign: usernames =>
    dispatch(removeJudgesFromPortfolioPeriod(portfolioPeriodId, usernames)),
  handleError: message => dispatch(displayError(message))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(AssignToPortfolioPeriodMutation, {
    props: ({ ownProps, mutate }) => ({
      assign: usernames =>
        mutate({
          variables: {
            portfolioPeriodId: ownProps.portfolioPeriodId,
            usernames
          },
          refetchQueries: [
            {
              query: JudgesForPortfolioPeriodQuery,
              variables: {
                id: ownProps.portfolioPeriodId
              }
            },
            {
              query: JudgesQuery
            }
          ]
        })
    })
  }),
  graphql(RemoveFromPortfolioPeriodMutation, {
    props: ({ ownProps, mutate }) => ({
      unassign: usernames =>
        mutate({
          variables: {
            portfolioPeriodId: ownProps.portfolioPeriodId,
            usernames
          },
          refetchQueries: [
            {
              query: JudgesForPortfolioPeriodQuery,
              variables: {
                id: ownProps.portfolioPeriodId
              }
            },
            {
              query: JudgesQuery
            }
          ]
        })
    })
  })
)(AssignJudgesTable);
