import { compose } from 'recompose'
import { connect } from 'react-redux'

import ManageJudgesTab from '../components/ManageJudgesTab'
import { fetchJudges } from '../actions'

const mapStateToProps = state => ({
  judges: Object.values(state.admin.judges)
})

const mapDispatchToProps = (dispatch, { showId }) => ({
  fetchJudges: () => dispatch(fetchJudges())
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(ManageJudgesTab)
