import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaPlusCircle from '@fortawesome/fontawesome-free-solid/faPlusCircle'
import FaBook from '@fortawesome/fontawesome-free-solid/faBook'
import FaYouTube from '@fortawesome/fontawesome-free-brands/faYoutube'
import FaVimeo from '@fortawesome/fontawesome-free-brands/faVimeoV'
import ReactCardFlip from 'react-card-flip';
import moment from 'moment'
import { Row, Col, Button } from 'reactstrap'

import { getImageThumbnail, STATIC_PATH } from '../../utils'

const PhotoThumbnail = styled.img`
  height: auto;
  margin-bottom: 10px;
  max-height: 7em;
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
  height: inherit;
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

class FlipCard extends React.Component {
  constructor() {
    super();
      this.state = {
      isFlipped: false
    };
    this.flip = this.flip.bind(this);
    this.unflip = this.unflip.bind(this);
  }

  flip(e) {
    e.preventDefault();
    this.setState({ isFlipped: true});
  }

  unflip(e) {
    e.preventDefault();
    this.setState({ isFlipped: false});
  }
 
  render() {
    return (
      <EntryContainer onMouseLeave={this.unflip} onMouseEnter={this.flip}>
      <ReactCardFlip isFlipped={this.state.isFlipped} flipDirection="horizontal" style={{minHeight: '8em'}}>
      <div key={'front'} style={{minHeight: '10em'}}>
          <EntryThumb entry={this.props.picture} />
          <Button color='secondary' style={{width: '100%'}} className="fixed-bottom" onClick={this.flip}>Options...</Button>
        </div>
 
        <div key={'back'} style={{minHeight: '10em',
          padding: 5,
          boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
          transition: '0.3s',
          borderRadius: '0.25rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: "column",}}>
        <Button color='primary' style={{width: '100%'}} >View</Button>
        {moment().isBefore(this.props.show.entryEnd) && (<Button color='primary' style={{width: '100%', marginBottom: '1em', marginTop: '1em'}} >Update</Button>)}
        {moment().isBefore(this.props.show.entryEnd) && (<Button color='danger' style={{width: '100%' }}>Delete</Button>)}
        </div>
      </ReactCardFlip>
      </EntryContainer>
    )
  }
}

const ShowEntry = ({entry, show})=>(     
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
)

export {FlipCard, NewSubmission, ShowEntry}