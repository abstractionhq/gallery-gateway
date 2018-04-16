import { connect } from 'react-redux'
import { compose } from 'recompose'

import NavBar from '../components/NavBar'
import { logout, switchToJudge } from '../../shared/actions'

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  switchToJudge: () => dispatch(switchToJudge())
})

export default compose(connect(null, mapDispatchToProps))(NavBar)
