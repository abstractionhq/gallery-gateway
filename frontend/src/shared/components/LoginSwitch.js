import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { shouldLogin, login } from '../actions'
import HomePage from '../../Home/Page'
import AdminPage from '../../Admin/Page'
import StudentPage from '../../Student/Page'

// Displays the splash page when logged out, otherwise
// loads the correct app component for this user.
class LoginSwitch extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    shouldLogin: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired
  }

  static defaultProps = {
    user: {}
  }

  componentDidMount () {
    if (this.props.shouldLogin()) {
      this.props.login()
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
      case 'STUDENT':
        return <StudentPage />
      default:
        // If for some reason, we receive an unknown user type, render the splash page
        // TODO: Make an error page that says:
        // 'Oops! An error occurred. Try clearing your storage and
        // cookies and refreshing the page. If the problem persists, contact ______.'
        return <HomePage />
    }
  }
}

const mapStateToProps = (state) => ({
  user: state.shared.auth.user
})

const mapDispatchToProps = (dispatch) => ({
  shouldLogin,
  login: () => dispatch(login())
})

export default compose(
  withRouter, // NOTE: Need to wrap w/ 'withRouter' since we're essentially simulating react-router's <Switch />
  connect(mapStateToProps, mapDispatchToProps)
)(LoginSwitch)
