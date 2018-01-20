import { connect } from 'react-redux'

import NavBar from '../components/NavBar'
import { logoutUser } from '../../shared/actions'

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logoutUser())
  }
}

export default connect(null, mapDispatchToProps)(NavBar)
