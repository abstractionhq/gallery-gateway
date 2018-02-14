import { connect } from 'react-redux'

import NavBar from '../components/NavBar'
import { logout, switchToAdmin } from '../../shared/actions'

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    switchToAdmin: () => dispatch(switchToAdmin())
  }
}

export default connect(null, mapDispatchToProps)(NavBar)
