import { graphql } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import { uploadImage, clearPreview } from '../actions'
import { displayError} from '../../shared/actions'

import CreatePortfolioPhoto from '../mutations/createPortfolioPhoto.graphql'
import PeriodForSubmission from '../queries/periodForSubmission.graphql'
import PortfolioByPeriod from '../queries/portfolioByPeriod.graphql'
import PortfolioPhotoForm from '../components/PortfolioPhotoForm'

const mapStateToProps = state => ({
  previewImage: state.student.ui.submission.previewFile || {},
  user: state.shared.auth.user
})

const mapDispatchToProps = dispatch => ({
  done: () => dispatch(push('/portfolio')),
  handleUpload: file => dispatch(uploadImage(file)),
  clearPreview: () => dispatch(clearPreview()),
  handleError: message => dispatch(displayError(message))
  // TODO: Removing an image -> you upload, but change your mind; put a 'x' on the top right corner
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(CreatePortfolioPhoto, {
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
)(PortfolioPhotoForm)
