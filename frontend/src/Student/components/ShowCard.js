import React, { Fragment } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { Row, Col } from 'reactstrap'
import moment from 'moment'
import {ShowEntry, NewSubmission} from './ImageCard'

const Card = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-bottom: 15px;
  padding: 10px;
  width: 100%;
`

const SubmittedEntries = ({ show }) =>
  show.entries.map(entry => (
    <Col
      md='3'
      className='text-center align-self-center d-flex justify-content-center align-items-center'
      style={{ minHeight: '10em' }}
      title={entry.title}
      key={entry.id}
    >
      <ShowEntry entry={entry} show={show}>
      </ShowEntry>
    </Col>
  ))

const ShowCard = props => (
  <Card>
    <Row>
      <Col style={{ display: 'flex' }}>
        <h2 style={{ alignSelf: 'flex-end', margin: 0 }}>{props.show.name}</h2>
      </Col>
      <Col className='text-right'>
        <div>
          <h5>
            {props.show.entries.filter(e => !e.group).length}/{
              props.show.entryCap
            }{' '}
            Individual Submissions
          </h5>
        </div>
        {moment().isAfter(moment(props.show.entryEnd)) ? (
          <div>No Longer Accepting Submissions</div>
        ) : (
          <div>
            Accepting Submissions Until:{' '}
            <Moment format='MMMM D, YYYY hh:mm:ss a'>
              {props.show.entryEnd}
            </Moment>
          </div>
        )}
      </Col>
    </Row>
    <hr />
    <Row style={{ minHeight: '250px' }} className='align-items-center'>
      <Fragment>
        {moment().isBefore(props.show.entryEnd) ? (
          <NewSubmission {...props} />
        ) : null}
        <SubmittedEntries {...props} />
      </Fragment>
    </Row>
  </Card>
)

ShowCard.propTypes = {
  show: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    entryCap: PropTypes.number,
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        entryType: PropTypes.oneOf(['PHOTO', 'VIDEO', 'OTHER']).isRequired,
        invited: PropTypes.bool,
        path: PropTypes.string,
        provider: PropTypes.oneOf(['youtube', 'vimeo']),
        videoId: PropTypes.string
      })
    ),
    entryStart: PropTypes.string,
    entryEnd: PropTypes.string,
    judgingStart: PropTypes.string,
    judgingEnd: PropTypes.string
  }).isRequired
}

ShowCard.defaultProps = {
  show: {
    entries: []
  }
}

export default ShowCard
