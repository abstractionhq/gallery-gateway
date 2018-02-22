import { connect } from 'react-redux'

import NavBar from '../components/NavBar'
import { logout } from '../../shared/actions'

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

export default connect(null, mapDispatchToProps)(NavBar)
