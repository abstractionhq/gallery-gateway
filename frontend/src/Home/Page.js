import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'

const Home = () => (
  <Container>
    <Row>
      <Col>
        <h1>Home</h1>
        <Link to='/admin'>Admin</Link>
      </Col>
    </Row>
  </Container>
)

export default Home
