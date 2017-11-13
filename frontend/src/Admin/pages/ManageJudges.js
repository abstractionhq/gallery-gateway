import React from 'react'
import { Container, Row, Col } from 'reactstrap'
import JudgesTable from '../containers/JudgesTable'

const ManageJudges = () => (
  <Container>
    <Row>
      <Col>
        <h1>Manage Judges</h1>
        <JudgesTable />
        {/* TODO: Form and Button to Create a new Judge */}
      </Col>
    </Row>
  </Container>
)

export default ManageJudges
