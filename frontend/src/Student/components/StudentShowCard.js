import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { Button, Col, Row} from 'reactstrap'

import NoSubmissions from './NoSubmissions'
import Submission from './Submission'
import NewSubmissionButton from './NewSubmissionButton'
import ShowInfo from './ShowInfo'
import ClosedSubmission from './ClosedSubmission'

const Card = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-top: 15px;
  padding: 10px 10px 15px 10px;
  width: 100%;
`

const NewSubmission = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
// <h2><Link to={`show/${props.id}`}>{props.name}</Link></h2>

const StudentShowCard = (props) => (
  <Card>
    <Row style={{justifyContent:'space-around'}}>
      <h2>Show1</h2>
      <ShowInfo entryEnd={props.entryEnd}></ShowInfo>
    </Row>
    <Row>
      <Col>
        <Submission></Submission>
      </Col>
      <Col>
        <NewSubmission>
          <NewSubmissionButton></NewSubmissionButton>
        </NewSubmission>
      </Col>

    </Row>
  </Card>
)

StudentShowCard.propTypes = {
  entryEnd: PropTypes.string.isRequired,
}

export default StudentShowCard
