import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import FaPlusCircle from 'babel-loader!react-icons/fa/plus-circle'
import FaBook from 'babel-loader!react-icons/fa/book'
import FaYouTube from 'babel-loader!react-icons/fa/youtube'
import FaVimeo from 'babel-loader!react-icons/fa/vimeo'
import { Button, ButtonGroup, Row, Col, UncontrolledTooltip } from 'reactstrap'

const Card = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-top: 15px;
  padding: 10px;
  width: 100%;
`

const PhotoThumbnail = styled.img`
    height: auto;
    width: auto;
    max-height: 10em;
    max-width: 100%;
`

const EntryNoThumbContainer = styled.div`
  height: auto;
  width: auto;
  max-height: 10em;
  max-width: 100%;
`

const renderEntry = (props, entry) => {
  switch (entry.__typename) {
    case 'Photo':
      return <div>
        <PhotoThumbnail
          path={entry.path}
          src={`//localhost:3000/static/uploads/${entry.path}`}
          id={`_thumbnail_${entry.id}`}
        />
        <UncontrolledTooltip placement='top' target={`_thumbnail_${entry.id}`}>
          {entry.title}
        </UncontrolledTooltip>
      </div>
    case 'Video':
      if (entry.provider === 'youtube') {
        return <a href={`https://youtube.com/watch?v=${entry.videoId}`}>
          <FaYouTube size='3em' />
          <h5>{entry.title}</h5>
        </a>
      } else if (entry.provider === 'vimeo') {
        return <a href={`https://vimeo.com/${entry.videoId}`}>
          <FaVimeo size='3em' />
          <h5>{entry.title}</h5>
        </a>
      }
      return null
    case 'OtherMedia':
      return <div>
        <FaBook size='3em' />
        <h5>{entry.title}</h5>
      </div>
    default:
      return null
  }
}

const renderEntries = (props) => (
  <Row>
    {
      props.entries.map(entry =>
        <Col className='text-center align-self-center h-100' key={entry.id}>
          {renderEntry(props, entry)}
        </Col>
      )
    }
  </Row>
)

const renderNoEntries = (props) => (
  <Row>
    <Col className='text-center align-self-center h-100'>
      <Link to={`/submit?to=${props.id}`} className='d-block w-100 h-100'>
        <FaPlusCircle size='3em' />
        <h5>New Submission</h5>
      </Link>
    </Col>
  </Row>
)

const ShowCard = (props) => (
  <Card>
    <Row>
      <Col>
        <h2>{props.name}</h2>
      </Col>
      <Col className="text-right">
        <div>
          <h5>{props.entries.length}/{props.entryCap} submissions</h5>
        </div>
        <div>
          Accepting Admissions until: <Moment format='YYYY/MM/DD'>{props.entryEnd}</Moment>
        </div>
      </Col>
    </Row>
    <hr />
    {
      props.entries.length === 0
        ? renderNoEntries(props)
        : renderEntries(props)
    }
  </Card>
)

ShowCard.defaultProps = {
  entries: []
}

ShowCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  entryCap: PropTypes.number.isRequired,
  entries: PropTypes.array.isRequired,
  entryStart: PropTypes.string.isRequired,
  entryEnd: PropTypes.string.isRequired,
  judgingStart: PropTypes.string.isRequired,
  judgingEnd: PropTypes.string.isRequired
}

export default ShowCard
