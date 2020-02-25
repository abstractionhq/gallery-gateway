import { graphql } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { displayError } from '../../shared/actions'

import PortfolioPeriodsQuery from '../queries/portfolioPeriods.graphql'
import CreatePortfolioPeriodMutation from '../mutations/createPortfolioPeriod.graphql'
import CreatePortfolioPeriodForm from '../components/CreatePortfolioPeriodForm'

const mapDispatchToProps = dispatch => ({
  done: () => dispatch(push('/portfolio/')),
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(null, mapDispatchToProps),
  graphql(CreatePortfolioPeriodMutation, {
    props: ({ mutate }) => ({
      create: show =>
        mutate({
          variables: { input: show }
        })
    }),
    options: () => ({
      refetchQueries: [
        {
          query: PortfolioPeriodsQuery
        }
      ]
    })
  })
)(CreatePortfolioPeriodForm)
