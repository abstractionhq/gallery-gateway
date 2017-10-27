import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Login extends Component {
  static propTypes = {
    user: PropTypes.object, // eslint-disable-line
    signIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
    checkLogin: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.attachClick();
    this.props.checkLogin();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user !== null && this.props.user === null) {
      this.attachClick();
    }
  }

  attachClick() {
    const auth2 = gapi.auth2.init({
      // Todo: fix client_id as string
      client_id: '344021361802-g8p23gnd7vlck1a9ndd1b4v8dsmmapmp.apps.googleusercontent.com', // eslint-disable-line camelcase
      cookie_policy: 'single_host_origin', // eslint-disable-line camelcase
    });
    auth2.attachClickHandler(
      this.button,
      { prompt: 'select_account' },
        googleUser => this.props.signIn(googleUser),
    );
  }

  render() {
    return this.props.user ? (
      <button className={this.props.className} onClick={this.props.signOut}><i className="fa fa-sign-out" /></button>
    ) : <button className={this.props.className} key="loggedin" ref={(c) => { this.button = c; }}><i className="fa fa-sign-in" /> Login</button>;
  }
}

export default Login;
