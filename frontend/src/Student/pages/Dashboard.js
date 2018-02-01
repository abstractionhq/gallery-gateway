import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'reactstrap'

const Dashboard = () => (
  <Container>
    <Row>
      <Col>
        <Link to="/submit">Submit</Link>
        {/* TODO: Show all open shows w/ link to any submissions a student made to them */}
      </Col>
    </Row>
  </Container>
)

export default Dashboard
