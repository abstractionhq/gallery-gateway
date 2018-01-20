// LoginSwitch displays the splash page when logged out,
// otherwise mounts the correct component for this user.

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import HomePage from '../../Home/Page'
import AdminPage from '../../Admin/Page'

class LoginSwitch extends Component {
  static propTypes = {
    user: PropTypes.object,
    userLogin: PropTypes.func
  }

  static defaultProps = {
    user: null
  }

  componentWillMount () {
    // put token into redux if needed
    if (window.localStorage.getItem('_token_v1')) {
      this.props.loginUser(window.localStorage.getItem('_token_v1'))
    }
  }

  render () {
    const {
      user
    } = this.props
    if (!user) {
      return <HomePage />
    }
    switch (user.type) {
      case 'ADMIN':
        return <AdminPage />
      default:
        return null
    }
  }
}

export default LoginSwitch
