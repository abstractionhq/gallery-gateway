import React from 'react'
import { Container } from 'reactstrap'
import styled from 'styled-components'

import AssignJudgesTable from '../containers/AssignJudgesTable'

const Heading = styled.h1`
  margin-bottom: 25px;
`

const ManageJudges = (props) => (
  <Container fluid>
    <Heading>Manage Judges</Heading> {/* TODO: Mention the name of the show */}
    <AssignJudgesTable showId={props.match.params.id} /> {/* TODO: Handle non-number input more gracefully */}
  </Container>
)

export default ManageJudges
