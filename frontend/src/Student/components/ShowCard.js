import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import FaPlusCircle from 'react-icons/lib/fa/plus-circle'
import FaBook from 'babel-loader!react-icons/fa/book'
import FaYouTube from 'babel-loader!react-icons/fa/youtube'
import FaVimeo from 'babel-loader!react-icons/fa/vimeo'
import { Row, Col, Alert } from 'reactstrap'
import moment from 'moment'

const Card = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-bottom: 15px;
  padding: 10px;
  width: 100%;
`

const PhotoThumbnail = styled.img`
  height: auto;
  width: auto;
  min-width: 4em;
  max-height: 10em;
  max-width: 100%;
`

const EntryNoThumbContainer = styled.div`
  height: 100%;
  padding: 15px;
`
const EntryContainer = styled.div`
  width: inherit
`

const JudgingPhase = styled.div`
  background-color: #fff3cd;
  border: 1px solid transparent;
  border-color: #ffeeba;
  border-radius: 0.25rem;
  color: #856404;
  position: relative;
`
const Accepted = styled.div`
  background-color: #d4edda;
  border: 1px solid transparent;
  border-color: #c3e6cb;
  border-radius: 0.25rem;
  color: #155724;
  position: relative;
  width: inherit
`

const NotAccepted = styled.div`
  background-color: #d6d8d9;
  border: 1px solid transparent;
  border-color: #c6c8ca;
  border-radius: 0.25rem;
  color: #1b1e21;
  position: relative;
`

const EntryThumb = ({ entry }) => {
  switch (entry.entryType) {
    case 'PHOTO':
      return (
        <PhotoThumbnail
          // TODO (robert) make this URL responsive to deploy environment
          src={`//localhost:3000/static/uploads/${entry.path}`}
        />
      )
    case 'VIDEO':
      const url =
        entry.provider === 'youtube'
          ? `https://youtube.com/watch?v=${entry.videoId}`
          : `https://vimeo.com/${entry.videoId}`
      const icon =
        entry.provider === 'youtube' ? (
          <FaYouTube size='3em' />
        ) : (
            <FaVimeo size='3em' />
          )
      return (
        <a href={url} target='_blank'>
          <EntryNoThumbContainer>
            {icon}
            <h5>{entry.title}</h5>
          </EntryNoThumbContainer>
        </a>
      )
    case 'OTHER':
      return (
        <EntryNoThumbContainer>
          <FaBook size='3em' />
          <h5>{entry.title}</h5>
        </EntryNoThumbContainer>
      )
    default:
      return null
  }
}

const NewSubmission = ({ show }) => (
  <Col
    style={{ minHeight: '10em' }}
    md={show.entries.length > 0 ? '3' : null}
    className='text-center align-self-center d-flex justify-content-center align-items-center'
  >
    <Link to={`/submit?to=${show.id}`}>
      <FaPlusCircle size='3em' />
      <h5 className='mt-1'>New Submission</h5>
    </Link>
  </Col>
)

const SubmittedEntries = ({ show }) =>
  show.entries.map(entry => (
    <Col
      md='3'
      className='text-center align-self-center d-flex justify-content-center align-items-center'
      style={{ minHeight: '10em' }}
      title={entry.title}
      key={entry.id}
    >
      <EntryContainer>
        <EntryThumb entry={entry} />
        {/* If after entry end and before judging end, display "judging phase" 
          , else display accepted or denied */
          moment().isBetween(show.entryEnd, show.judgingEnd) ? (
            <JudgingPhase>Judging In Progress</JudgingPhase>
          ) : moment().isAfter(show.judgingEnd) ? (
            entry.invited ? (
              <Accepted>Invited</Accepted>
            ) : (
                <NotAccepted>Not Invited</NotAccepted>
              )
          ) : null}
      </EntryContainer>
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
            {props.show.entries.length}/{props.show.entryCap} Submissions
          </h5>
        </div>
        {moment().isAfter(moment(props.show.entryEnd)) ? (
          <div>No Longer Accepting Submissions</div>
        ) : (
            <div> Accepting Submissions Until:{' '}
              <Moment format='MMMM Do YYYY'>{props.show.entryEnd}</Moment></div>
          )}
      </Col>
    </Row>
    <hr />
    <Row style={{ minHeight: '250px' }} className='align-items-center'>
      <Fragment>
        {moment().isBefore(props.show.entryEnd) ? <NewSubmission {...props} /> : null}
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
