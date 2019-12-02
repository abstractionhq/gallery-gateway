import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import styled from 'styled-components'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaImage from '@fortawesome/fontawesome-free-regular/faImage'
import FaVideo from '@fortawesome/fontawesome-free-solid/faVideo'
import FaBook from '@fortawesome/fontawesome-free-solid/faBook'

const Header = styled.h2`
  margin-top: 25px;
  margin-bottom: 25px;
  text-align: center;

  @media (min-width: 576px) {
    margin-top: 75px;
  }

  @media (min-width: 768px) {
    margin-top: 150px;
  }
`

const SubmissionContainer = styled.section`
  margin-bottom: 25px;
  min-height: 250px;
  padding-top: 70px;
  text-align: center;
`

const PortfolioFormChooser = props => (
  <Fragment>
    <Header>What are you submitting?</Header>
    <Row>
      <Col xs='12' sm='6' md='4'>
        <Link
          to={`/add/photo?to=${props.id}`}
          style={{ textDecoration: 'none', display: 'block' }}
          className='bg-light'
        >
          <SubmissionContainer className='text-dark'>
            <FontAwesomeIcon icon={FaImage} size='4x' />
            <h3>Photo</h3>
          </SubmissionContainer>
        </Link>
      </Col>
      <Col xs='12' sm='6' md='4'>
        <Link
          to={`/add/video?to=${props.id}`}
          style={{ textDecoration: 'none', display: 'block' }}
          className='bg-light'
        >
          <SubmissionContainer className='text-dark'>
            <FontAwesomeIcon icon={FaVideo} size='4x' />
            <h3>Video</h3>
            <p>(YouTube or Vimeo)</p>
          </SubmissionContainer>
        </Link>
      </Col>
      <Col xs='12' md='4'>
        <Link
          to={`/add/other?to=${props.id}`}
          style={{ textDecoration: 'none', display: 'block' }}
          className='bg-light'
        >
          <SubmissionContainer className='text-dark'>
            <FontAwesomeIcon icon={FaBook} size='4x' />
            <h3>Other</h3>
            <p>(eg. A book or physical art)</p>
          </SubmissionContainer>
        </Link>
      </Col>
    </Row>
  </Fragment>
)

export default PortfolioFormChooser
