import { connect } from 'react-redux'
import { compose } from 'recompose'

import NavBar from '../components/NavBar'
import { logout } from '../../shared/actions'

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout())
})

export default compose(connect(null, mapDispatchToProps))(NavBar)
