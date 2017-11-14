import React from 'react'
import { Container } from 'reactstrap'
import styled from 'styled-components'

import JudgeAssignmentTables from '../containers/JudgeAssignmentTables'

const Heading = styled.h1`
  margin-bottom: 25px;
`

const ManageJudges = (props) => (
  <Container fluid>
    <Heading>Manage Judges</Heading> {/* TODO: Mention the name of the show */}
    <JudgeAssignmentTables show={props.match.params.id} />
  </Container>
)

export default ManageJudges
