import React from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Button } from 'reactstrap'

import SubmissionForm from '../containers/SubmissionForm'

const Submit = () => (
  <Container>
    <Row>
      <Col>
        <h1>New Submission</h1>
        <SubmissionForm />
      </Col>
    </Row>
  </Container>
)

export default Submit
