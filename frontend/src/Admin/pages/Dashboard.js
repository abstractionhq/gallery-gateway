import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'reactstrap'

import Shows from '../containers/Shows'

const Dashboard = () => (
  <Container>
    <Row>
      <Col>
        <h1>Dashboard</h1>
        <Shows />
      </Col>
      <Col md='3'>
        <Button color='primary' style={{cursor: 'pointer'}} tag={Link} to='/show/create'>Create Show</Button>
      </Col>
    </Row>
  </Container>
)

export default Dashboard
