import { connect } from 'react-redux'
import { compose } from 'recompose'

import NavBar from '../components/NavBar'
import { logout, switchToAdmin } from '../../shared/actions'

const mapStateToProps = state => ({
  user: state.shared.auth.user
})

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  switchToAdmin: () => dispatch(switchToAdmin())
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(NavBar)
