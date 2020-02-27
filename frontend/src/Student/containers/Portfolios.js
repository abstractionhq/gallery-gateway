import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import PortfoliosQuery from '../queries/portfoliosByStudent.graphql'
import OpenPortfolioPeriodQuery from '../queries/openPortfolioPeriod.graphql'
import DeletePiece from '../mutations/deletePiece.graphql'
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
      portfoliosLoading: loading,
      portfolios: portfoliosByStudent,
      portfoliosError: error
    }),
    options: ownProps => ({
      variables: {
        studentUsername: ownProps.studentUsername
      }
    })    
  }),
  graphql(OpenPortfolioPeriodQuery,{
    props: ({ data: {loading, openPortfolioPeriod, error}}) => ({
      openPeriodLoading: loading,
      openPeriod: openPortfolioPeriod,
      openPeriodError: error
    }),
    options:ownProps => ({
      variables: {
        studentUsername: ownProps.studentUsername
      }
    })   
  }),
  graphql(DeletePiece, {
    props: ({ mutate }) => ({
      deletePiece: (id) =>
        mutate({
          variables: { id }
        })
    }),
    options: ownProps => ({
      refetchQueries: [
        {
          query: PortfoliosQuery,
          variables: {
            studentUsername: ownProps.studentUsername
          }
        }
      ]
    })
  })
)(Portfolios)
