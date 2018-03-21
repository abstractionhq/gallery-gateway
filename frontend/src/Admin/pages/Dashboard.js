import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'reactstrap'

import Shows from '../containers/Shows'

const Dashboard = () => (
  <Container>
    <Row className='align-items-baseline'>
      <Col>
        <h1>Dashboard</h1>
      </Col>
      <Col md='3'>
        <Button
          color='primary'
          className='btn-block'
          style={{ cursor: 'pointer' }}
          tag={Link}
          to='/show/new'
        >
          Create Show
        </Button>
      </Col>
    </Row>
    <Row>
      <Col>
        <Shows />
      </Col>
    </Row>
  </Container>
)

export default Dashboard
