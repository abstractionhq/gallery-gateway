import { graphql } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { uploadImage, clearPreview } from '../actions'
import { displayError} from '../../shared/actions'

import CreatePortfolioOtherMedia from '../mutations/createPortfolioOtherMedia.graphql'
import PeriodForSubmission from '../queries/periodForSubmission.graphql'
import PortfolioByPeriod from '../queries/portfolioByPeriod.graphql'
import PortfolioOtherMediaForm from '../components/PortfolioOtherMediaForm'

const mapStateToProps = state => ({
  previewFile: state.student.ui.submission.previewFile || {},
  user: state.shared.auth.user
})

const mapDispatchToProps = dispatch => ({
  done: () => dispatch(push('/portfolio')),
  handlePDFUpload: file => dispatch(uploadPDF(file)),
  handleImageUpload: file => dispatch(uploadImage(file)),
  clearPreview: () => dispatch(clearPreview()),
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(CreatePortfolioOtherMedia, {
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
)(PortfolioOtherMediaForm)
