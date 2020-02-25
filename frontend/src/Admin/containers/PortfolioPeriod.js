import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import PortfolioPeriodsQuery from '../queries/portfolioPeriods.graphql'
import PortfolioPeriod from '../components/PortfolioPeriod'
import { displayError } from '../../shared/actions'

const mapDispatchToProps = dispatch => ({
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(null, mapDispatchToProps),
  graphql(PortfolioPeriodsQuery, {
    props: ({ ownProps, data: { portfolioPeriods, loading, error } }) => ({
      portfolioPeriods,
      loading,
      error
    })
  })
)(PortfolioPeriod)
