import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { Flex, Box } from 'rebass'
import { Button } from 'reactstrap'

const Card = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-top: 15px;
  padding: 10px;
  width: 100%;
`

const ShowCard = (props) => (
  <Card>
    <h2><Link to={`show/${props.id}`}>{props.name}</Link></h2>
    <Flex>
      <Box w={1/2}>
        <dl>
          <dt>Submission Starts:</dt>
          <dd><Moment format='YYYY/MM/DD'>{props.entryStart}</Moment></dd>
          <dt>Submission Ends:</dt>
          <dd><Moment format='YYYY/MM/DD'>{props.entryEnd}</Moment></dd>
        </dl>
        <Link to={`show/${props.id}/submissions`}><Button color='info' style={{cursor: 'pointer'}}>View Submissions</Button></Link>
      </Box>
      <Box w={1/2}>
        <dl>
          <dt>Judging Starts:</dt>
          <dd><Moment format='YYYY/MM/DD'>{props.judgingStart}</Moment></dd>
          <dt>Judging Ends:</dt>
          <dd><Moment format='YYYY/MM/DD'>{props.judgingEnd}</Moment></dd>
        </dl>
        <Link to={`show/${props.id}/judges`}><Button color='info' style={{cursor: 'pointer'}}>Manage Judges</Button></Link>
      </Box>
    </Flex>
  </Card>
)

ShowCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  entryStart: PropTypes.string.isRequired,
  entryEnd: PropTypes.string.isRequired,
  judgingStart: PropTypes.string.isRequired,
  judgingEnd: PropTypes.string.isRequired
}

export default ShowCard
