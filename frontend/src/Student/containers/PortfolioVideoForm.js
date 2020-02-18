import { graphql } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { uploadImage, clearPreview } from '../actions'
import { displayError} from '../../shared/actions'

import CreatePortfolioVideo from '../mutations/createPortfolioVideo.graphql'
import PeriodForSubmission from '../queries/periodForSubmission.graphql'
import PortfolioByPeriod from '../queries/portfolioByPeriod.graphql'
import PortfolioVideoForm from '../components/PortfolioVideoForm'

const mapStateToProps = state => ({
  user: state.shared.auth.user
})

const mapDispatchToProps = dispatch => ({
  done: () => dispatch(push('/portfolio')),
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(CreatePortfolioVideo, {
    props: ({ mutate }) => ({
      create: entry =>
        mutate({
          variables: { input: entry }
        })
    })
  }),
  graphql(PeriodForSubmission, {
    name: "portfolioPeriod",
    options: ownProps => ({
      variables: {
        id: ownProps.id
      }
    })
  }),
  graphql(PortfolioByPeriod, {
    name: "portfolio",
    options: ownProps => ({
      variables: {
        periodId: ownProps.id,
      }
    })
  })
)(PortfolioVideoForm)
