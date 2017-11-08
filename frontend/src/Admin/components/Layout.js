import React from 'react'
import { Container } from 'reactstrap'

import NavBar from './NavBar'

const Layout = (props) => (
  <main>
    <NavBar />
    <Container>
      {props.children}
    </Container>
  </main>

)

export default Layout
