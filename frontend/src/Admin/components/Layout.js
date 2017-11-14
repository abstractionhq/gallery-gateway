import React from 'react'

import NavBar from './NavBar'

const Layout = (props) => (
  <main>
    <NavBar />
    {props.children}
  </main>

)

export default Layout
