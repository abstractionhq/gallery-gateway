import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Collapse, Navbar, NavbarToggler, Nav, NavItem } from 'reactstrap'
import styled from 'styled-components'

const NavBarContainer = styled.div`
  margin-bottom: 25px;
`

export default class NavBar extends Component {
  constructor (props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false
    }
  }
  toggle () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render () {
    return (
      <NavBarContainer>
        <Navbar color='dark' dark expand='md'>
          <Link to='/admin/' className='navbar-brand'>Gallery Gateway</Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Link to='/admin/judges' className='nav-link'>Manage Judges</Link>
              </NavItem>
              <NavItem>
                <Link to='/admin/reports' className='nav-link'>Reports</Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </NavBarContainer>
    )
  }
}
