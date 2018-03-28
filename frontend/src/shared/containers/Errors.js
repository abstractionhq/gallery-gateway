import { connect } from 'react-redux'

import { dismissError } from '../actions'
import Errors from '../components/Errors'

const mapStateToProps = state => ({
  errors: state.shared.errors
})

const mapDispatchToProps = dispatch => ({
  dismiss: (index) => dispatch(dismissError(index))
})

export default connect(mapStateToProps, mapDispatchToProps)(Errors)
