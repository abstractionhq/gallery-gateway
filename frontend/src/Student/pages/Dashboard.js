import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'reactstrap'

import StudentShowCard from '../components/StudentShowCard'

const Dashboard = () => (
  <Container>
    <Row>
      <Col>
        <Link to="/submit">Submit</Link>
        {/* TODO: Show all open shows w/ link to any submissions a student made to them */}
        <StudentShowCard> </StudentShowCard>
      </Col>
    </Row>
  </Container>
)

export default Dashboard
