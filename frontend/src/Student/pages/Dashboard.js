import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'reactstrap'

import Shows from '../containers/Shows'

const Dashboard = () => (
  <Container>
    <Row>
      <Col>
        <Shows/>
        {/* TODO: Show all open shows w/ link to any submissions a student made to them */}
      </Col>
    </Row>
  </Container>
)

export default Dashboard
