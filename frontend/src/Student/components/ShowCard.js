import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle'
import FaBook from '@fortawesome/fontawesome-free-solid/faBook'
import FaYouTube from '@fortawesome/fontawesome-free-brands/faYoutube'
import FaVimeo from '@fortawesome/fontawesome-free-brands/faVimeoV'
import { Row, Col } from 'reactstrap'
import moment from 'moment'

import { getImageThumbnail, STATIC_PATH } from '../../utils'

const Card = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-bottom: 15px;
  padding: 10px;
  width: 100%;
`

const PhotoThumbnail = styled.img`
  height: auto;
  margin-bottom: 10px;
  max-height: 10em;
  max-width: 100%;
  min-width: 4em;
  width: auto;
`

const EntryNoThumbContainer = styled.div`
  color: black;
  height: 100%;
  margin-bottom: 10px;
  padding: 15px;
`
const EntryContainer = styled.div`
  width: inherit;
`

const Pending = styled.div`
  background-color: #fff3cd;
  border: 1px solid transparent;
  border-color: #ffeeba;
  border-radius: 0.25rem;
  color: #856404;
  position: relative;
  width: inherit;
`
const Invited = styled.div`
  background-color: #d4edda;
  border: 1px solid transparent;
  border-color: #c3e6cb;
  border-radius: 0.25rem;
  color: #155724;
  position: relative;
  width: inherit;
`

const NotInvited = styled.div`
  background-color: #d6d8d9;
  border: 1px solid transparent;
  border-color: #c6c8ca;
  border-radius: 0.25rem;
  color: #1b1e21;
  position: relative;
  width: inherit;
`

const EntryThumb = ({ entry }) => {
  switch (entry.entryType) {
    case 'PHOTO':
      return (
        <PhotoThumbnail
          src={`${STATIC_PATH}${getImageThumbnail(entry.path)}`}
        />
      )
    case 'VIDEO':
      const url =
        entry.provider === 'youtube'
          ? `https://youtube.com/watch?v=${entry.videoId}`
          : `https://vimeo.com/${entry.videoId}`
      const icon =
        entry.provider === 'youtube' ? (
          <FontAwesomeIcon icon={FaYouTube} size='3x' />
        ) : (
          <FontAwesomeIcon icon={FaVimeo} size='3x' />
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
          <FontAwesomeIcon icon={FaBook} size='3x' />
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
      <FontAwesomeIcon icon={FaPlusCircle} size='3x' />
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
        {/* If after entry end and before judging end (or if the show is not finalized),
          display "Pending", else display invited or not invited */
          moment().isBetween(show.entryEnd, show.judgingEnd) ||
        !show.finalized ? (
              <Pending>Pending</Pending>
            ) : moment().isAfter(show.judgingEnd) ? (
              entry.invited ? (
                <Invited>Invited</Invited>
              ) : (
                <NotInvited>Not Invited</NotInvited>
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
            <Moment format='MMMM D, YYYY'>{props.show.entryEnd}</Moment>
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
