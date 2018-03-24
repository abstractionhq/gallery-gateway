import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import Shows from '../containers/Shows'

const Dashboard = () => (
  <Container style={{ paddingTop: '25px' }}>
    <Row>
      <Col>
        <h1>Dashboard</h1>
        <Shows />
      </Col>
    </Row>
  </Container>
)

export default Dashboard
