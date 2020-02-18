import React from 'react'
import { Container, Row, Col } from 'reactstrap'

import Portfolios from '../containers/Portfolios'

const Portfolio = () => (
  <Container>
    <Row>
      <Col>
        <Portfolios />
      </Col>
    </Row>
  </Container>
)

export default Portfolio
