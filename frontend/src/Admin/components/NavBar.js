import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, NavLink } from 'reactstrap'
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

  logout () {
    window.localStorage.removeItem('_token_v1')
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
                <NavLink tag={Link} to='/admin/judges'>Judges</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to='/admin/reports'>Reports</NavLink>
              </NavItem>
              <NavItem>
                <Link to='/' className='nav-link' onClick={this.logout}>Logout</Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </NavBarContainer>
    )
  }
}
