import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import Portfolios from '../containers/Portfolios'

const Portfolio = () => (
  <Container>
    <Row>
      <Col>
        <Portfolios />
        {/* TODO: Show all open shows w/ link to any submissions a student made to them */}
      </Col>
    </Row>
  </Container>
)

export default Portfolio
