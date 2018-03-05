import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import Shows from '../containers/Shows'

const Dashboard = () => (
  <Container>
    <Row>
      <Col>
        <Shows studentUsername='user3'/>
        {/* TODO: Show all open shows w/ link to any submissions a student made to them */}
      </Col>
    </Row>
  </Container>
)

export default Dashboard
