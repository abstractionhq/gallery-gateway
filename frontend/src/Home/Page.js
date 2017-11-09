import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'

const Home = () => (
  <Container>
    <Row>
      <Col>
        <h1>Home</h1>
        <ul>
          <li>
            <Link to='/admin'>Admin</Link>
          </li>
          <li>
            <a href='http://localhost:3000/auth/login'>Login</a>
          </li>
        </ul>
      </Col>
    </Row>
  </Container>
)

export default Home
