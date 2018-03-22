import React from 'react'

import NavBar from '../containers/NavBar'
import ErrorMessage from './ErrorMessage'

const Layout = props => (
  <main>
    <NavBar />
    <ErrorMessage />
    {props.children}
  </main>
)

export default Layout
