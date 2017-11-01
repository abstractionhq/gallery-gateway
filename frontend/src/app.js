import 'babel-polyfill' // See: https://babeljs.io/docs/usage/polyfill/#usage-in-node-browserify-webpack

import React from 'react'
import ReactDom from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Root from './'

const render = Component => {
  ReactDom.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  )
}

window.onload = () => {
  //
  // if the jwt token is in the cookie, read that in, and then delete the
  // cookie

  // from https://stackoverflow.com/q/10730362
  function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }
  if (getCookie('_token_v1')) {
    // from https://stackoverflow.com/a/10593045
    function delete_cookie(name) {
      document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };
    window.localStorage.setItem('_token_v1', getCookie('_token_v1'));
    delete_cookie('_token_v1');
  }

  //
  // Start rendering the main site
  render(Root)
}

if (module.hot) {
  module.hot.accept('./', () => {
    render(Root)
  })
}
