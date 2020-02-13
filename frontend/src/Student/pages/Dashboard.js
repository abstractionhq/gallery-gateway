import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import Shows from '../containers/Shows'

const Dashboard = () => (
  <Container>
    <Row>
      <Col>
        <Shows />
      </Col>
    </Row>
  </Container>
)

export default Dashboard
