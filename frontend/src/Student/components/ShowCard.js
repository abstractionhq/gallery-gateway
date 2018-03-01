import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import FaPlusCircle from 'react-icons/lib/fa/plus-circle'
import FaBook from 'react-icons/lib/fa/book'
import FaYouTube from 'react-icons/lib/fa/youtube'
import FaVimeo from 'react-icons/lib/fa/vimeo'
import { Row, Col } from 'reactstrap'

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
        <div>
          Accepting Submissions Until:{' '}
          <Moment format='MMMM Do YYYY'>{props.show.entryEnd}</Moment>
        </div>
      </Col>
    </Row>
    <hr />
    <Row style={{ minHeight: '250px' }} className='align-items-center'>
      <Col
        style={{ minHeight: '10em' }}
        md={props.show.entries.length > 0 ? '3' : null}
        className='text-center align-self-center d-flex justify-content-center align-items-center'
      >
        <Link to={`/submit?to=${props.show.id}`}>
          <FaPlusCircle size='3em' />
          <h5 className='mt-1'>New Submission</h5>
        </Link>
      </Col>
      {props.show.entries.map(entry => (
        <Col
          md='3'
          className='text-center align-self-center d-flex justify-content-center align-items-center'
          style={{ minHeight: '10em' }}
          title={entry.title}
          key={entry.id}
        >
          <EntryThumb entry={entry} />
        </Col>
      ))}
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
