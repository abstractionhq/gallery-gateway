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
  render(Root)
}

if (module.hot) {
  module.hot.accept('./', () => {
    render(Root)
  })
}
