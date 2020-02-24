import React, { Fragment } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import { Row, Col, Button } from 'reactstrap'
import moment from 'moment'
import {FlipCard, NewPiece} from './ImageCard'

const Card = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-bottom: 15px;
  padding: 10px;
  width: 100%;
`

const SubmittedEntries = ({ portfolio, deletePiece }) =>
  portfolio.pieces.map(piece => (
    <Col md='3'
    className='mb-3 text-center align-self-center d-flex justify-content-center align-items-center'
    style={{ minHeight: '10em' }}
    title={piece.title}
    key={piece.id}>
    <FlipCard
      picture={piece}
      portfolio={portfolio}
      deletePiece={() => deletePiece(piece.id)}
      style={{width: '100%', height: '100%'}}>
    </FlipCard>
  </Col>
  ))


const PortfolioCard = props => (
  <Card>
    <Row>
      <Col>
        <div><h2>{props.portfolio.portfolioPeriod.name}</h2></div>
        <div>
          <h5>
            {props.portfolio.pieces.length}/{
              props.portfolio.portfolioPeriod.numPieces
            }{' '}
            Pieces
          </h5>
        </div>
      </Col>
      <Col className='text-right'>

        {moment().isAfter(moment(props.portfolio.portfolioPeriod.entryEnd)) ? (
          <div>No Longer Accepting Applications</div>
        ) : (
          <div>
          <div>
          <h2><Button color='primary'>Apply</Button></h2>
          </div>
          <div>
            Accepting Applications Until:{' '}
            <Moment format='MMMM D, YYYY hh:mm:ss a'>
              {props.portfolio.portfolioPeriod.entryEnd}
            </Moment>
          </div>
          </div>
        )}
      </Col>
    </Row>
    <hr />
    <Row style={{ minHeight: '250px' }} className='align-items-center'>
      <Fragment>
        {moment().isBefore(props.portfolio.portfolioPeriod.entryEnd)
        && props.portfolio.pieces.length < props.portfolio.portfolioPeriod.numPieces? (
          <NewPiece {...props} />
        ) : null}
        <SubmittedEntries {...props} />
      </Fragment>
    </Row>
  </Card>
)

PortfolioCard.propTypes = {
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

PortfolioCard.defaultProps = {
  show: {
    entries: []
  }
}

export default PortfolioCard
