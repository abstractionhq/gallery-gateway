import React from 'react'

import NavBar from '../containers/NavBar'

const Layout = (props) => (
  <main>
    <NavBar />
    {props.children}
  </main>

)

export default Layout
