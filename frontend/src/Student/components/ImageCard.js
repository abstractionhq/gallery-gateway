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
import Flippy, { FrontSide, BackSide } from 'react-flippy';
import ReactCardFlip from 'react-card-flip';
import { Row, Col, Button } from 'reactstrap'
import moment from 'moment'

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
 
        <div key={'back'} style={{minHeight: '10em'}}>
        <Button color='primary' style={{width: '100%'}} className="mb-4" >View</Button>
        <Button color='primary' style={{width: '100%'}} >Update</Button>
        <Button color='danger' style={{width: '100%' }} className="fixed-bottom">Delete</Button>
        </div>
      </ReactCardFlip>
      </EntryContainer>
    )
  }
}

class DarkCard extends React.Component {
  constructor() {
    super();
      this.state = {
      isHovered: false
    };
    this.hover = this.hover.bind(this);
    this.leave = this.leave.bind(this);
  }

  hover(e) {
    e.preventDefault();
    this.setState({ isHovered: true});
  }

  leave(e) {
    e.preventDefault();
    this.setState({ isHovered: false});
  }
 
  render() {
    return (
      <EntryContainer onMouseLeave={this.leave} onMouseEnter={this.hover} style = {{minHeight: '10em'}}>
          <EntryThumb entry={this.props.picture} />
          {!this.state.isHovered && (<Button color='secondary' style={{width: '100%'}} onClick={this.hover}>Options...</Button>)}
          {this.state.isHovered && (<div class= "align-content-around d-flex" style= 
        {{position: 'absolute',
          padding: 5,
          top: 0,
          right: 10,
          left: 10,
          alignItems: 'center',
          flexDirection: "column",
          backgroundColor: 'rgba(0,0,0,0.5)',
          borderRadius: '0.25rem',
          minHeight: '10em',
          display: 'flex',
          justifyContent: 'center'}}
          >
              
        <Button color='primary' style={{width: '100%'}}>View</Button>
        <Button color='primary' style={{width: '100%', marginBottom: '1em', marginTop: '1em'}}>Update</Button>
        <Button color='danger' style={{width: '100%' }}>Delete</Button>
        </div>)}
      </EntryContainer>
    )
  }
}

export {FlipCard, DarkCard}