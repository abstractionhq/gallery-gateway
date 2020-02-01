import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import ShowsQuery from '../queries/shows.graphql'
import PortfoliosQuery from '../queries/portfoliosByStudent.graphql'
import Portfolios from '../components/Portfolios'
import { displayError } from '../../shared/actions'

const mapStateToProps = state => ({
  studentUsername: state.shared.auth.user.username
})

const mapDispatchToProps = dispatch => ({
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(PortfoliosQuery,{
    props: ({ data: {loading, portfoliosByStudent, error}}) => ({
      loading,
      portfolios: portfoliosByStudent,
      error
    }),
    options: ownProps => ({
      variables: {
        studentUsername: ownProps.studentUsername
      }
    })    
  })
)(Portfolios)
