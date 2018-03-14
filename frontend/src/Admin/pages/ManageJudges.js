import React from 'react'
import Status from '../../shared/containers/Status'
import { Container, Row, Col } from 'reactstrap'

const ManageJudges = () => (
  <Container>
    <Row>
      <Col>
        <Status />
        <h1>ManageJudges</h1>
      </Col>
    </Row>
  </Container>
)

export default ManageJudges
