import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import LoginSwitch from '../components/LoginSwitch'
import { loginUser } from '../actions'

const mapDispatchToProps = (dispatch) => {
  return {
    loginUser: (token) => dispatch(loginUser(token))
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.shared.auth.user
  }
}

const withRedux = connect(mapStateToProps, mapDispatchToProps)(LoginSwitch)

export default withRouter(withRedux)
