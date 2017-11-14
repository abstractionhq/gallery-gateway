import React from 'react'
import { Container, Row, Col, Button } from 'reactstrap'
import { Flex, Box } from 'rebass'
import styled from 'styled-components'

import JudgesTable from '../containers/JudgesTable'

const Heading = styled.h1`
  margin-bottom: 25px;
`

const CenteredSubHeading = styled.h2`
  text-align: center;
`

const ManageJudges = () => (
  <Container fluid>
    <Heading>Manage Judges</Heading> {/* TODO: Mention the name of the show */}
    <Row>
      <Col>
        {/* TODO: This table queries Judges not currently assigned to this call */}
        <CenteredSubHeading>Unassigned</CenteredSubHeading>
        <JudgesTable />
        {/* TODO: Form and Button to Create a new Judge */}
      </Col>
      <Col sm='2'>
        <Flex column align='center' justify='center' style={{minHeight: '50vh'}}>
          <Box mb={50} w='100%'>
            <Button color='primary' block style={{cursor: 'pointer'}}>Assign <span className='oi oi-arrow-right' ariaHidden='true'></span></Button>
          </Box>
          <Box mt={50} w='100%'>
            <Button color='primary' block style={{cursor: 'pointer'}}><span className='oi oi-arrow-left' ariaHidden='true'></span> Unassign</Button>
          </Box>
        </Flex>
      </Col>
      <Col>
        {/* TODO: This table queries Judges currently assigned to this call */}
        <CenteredSubHeading>Assigned</CenteredSubHeading>
        <JudgesTable />
      </Col>
    </Row>
  </Container>
)

export default ManageJudges
