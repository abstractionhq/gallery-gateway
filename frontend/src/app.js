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
  // get rid of jwt token in hash, if exists
  // THIS IS AWFUL I HATE IT
  const parts = window.location.hash.split("?");
  if (parts.length === 2) {
    const params = new URLSearchParams(parts[1]);
    if (params.has("token")) {
      // great, we've got a new token
      window.localStorage.setItem("_token_v1", params.get("token"));
      // now let's remove it from the url hash :[
      params.delete("token");
      if (params.toString() !== "") {
        window.location.hash = parts[0] + "?" + params.toString();
      } else {
        window.location.hash = parts[0];
      }
    }
  }
  render(Root)
}

if (module.hot) {
  module.hot.accept('./', () => {
    render(Root)
  })
}
