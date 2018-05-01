import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap'

class NavBar extends Component {
  static propTypes = {
    user: PropTypes.shape({
      type: PropTypes.string
    }).isRequired,
    logout: PropTypes.func.isRequired,
    switchToAdmin: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      isOpen: false
    }
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  renderSwitchToAdmin = () => {
    return (
      <Fragment>
        <NavItem>
          <NavLink tag={Link} to='/' onClick={this.props.switchToAdmin}>
            View as Admin
          </NavLink>
        </NavItem>
        <li>
          <span
            className='text-muted d-md-block d-none'
            style={{ padding: '8px', cursor: 'default' }}
          >
            |
          </span>
        </li>
      </Fragment>
    )
  }

  render () {
    const isAdmin = this.props.user.type === 'ADMIN'

    return (
      <div>
        <Navbar color='dark' dark expand='md'>
          <Link to='/' className='navbar-brand'>
            Gallery Gateway
          </Link>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className='ml-auto' navbar>
              {isAdmin ? this.renderSwitchToAdmin() : null}
              <NavItem>
                <Link to='/' className='nav-link' onClick={this.props.logout}>
                  Logout
                </Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    )
  }
}

export default NavBar
