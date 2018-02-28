import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'reactstrap'

import Shows from '../containers/Shows'

const Dashboard = () => (
  <Container>
    <Row>
      <Col>
        <h1>Dashboard</h1>
      </Col>
      <Col>{/* TODO: Show voting page */}</Col>
    </Row>
    <Row>
      <Col>
        <Shows />
      </Col>
    </Row>
  </Container>
)

export default Dashboard
