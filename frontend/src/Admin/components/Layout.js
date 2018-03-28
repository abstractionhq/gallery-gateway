import React from 'react'

import NavBar from '../containers/NavBar'
import Errors from '../../shared/containers/Errors'

const Layout = props => (
  <main>
    <NavBar />
    <Errors />
    {props.children}
  </main>
)

export default Layout
