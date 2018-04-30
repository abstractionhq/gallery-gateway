import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { shouldLogin, login } from '../actions'
import HomePage from '../../Home/Page'
import AdminPage from '../../Admin/Page'
import JudgePage from '../../Judge/Page'
import StudentPage from '../../Student/Page'

// Displays the splash page when logged out, otherwise
// loads the correct app component for this user.
class LoginSwitch extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    performingRole: PropTypes.string.isRequired,
    shouldLogin: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired
  }

  static defaultProps = {
    user: {},
    performingRole: 'ADMIN'
  }

  componentDidMount () {
    if (this.props.shouldLogin()) {
      this.props.login()
    }
  }

  render () {
    const { user, performingRole } = this.props

    if (!user) {
      return <HomePage />
    }

    switch (user.type) {
      case 'ADMIN':
        if (performingRole === 'JUDGE') {
          return <JudgePage />
        } else {
          return <AdminPage />
        }
      case 'JUDGE':
        return <JudgePage />
      case 'STUDENT':
        return <StudentPage />
      default:
        // If for some reason, we receive an unknown user type, throw an error,
        // so that the error boundary can catch it and render the error page
        throw new Error('Unknown User Type')
    }
  }
}

const mapStateToProps = state => ({
  user: state.shared.auth.user,
  performingRole: state.shared.auth.performingRole
})

const mapDispatchToProps = dispatch => ({
  shouldLogin,
  login: () => dispatch(login())
})

export default compose(
  withRouter, // NOTE: Need to wrap w/ 'withRouter' since we're essentially simulating react-router's <Switch />
  connect(mapStateToProps, mapDispatchToProps)
)(LoginSwitch)
