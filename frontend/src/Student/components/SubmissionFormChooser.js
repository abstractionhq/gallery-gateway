import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import styled from 'styled-components'
import FaImage from 'babel-loader!react-icons/fa/image'
import FaVideo from 'babel-loader!react-icons/fa/video-camera'
import FaBook from 'babel-loader!react-icons/fa/book'

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

const SubmissionFormChooser = (props) => (
  <Fragment>
    <Header>What are you submitting?</Header>
    <Row>
      <Col xs='12' sm='6' md='4'>
        <Link to={`/submit/${props.match.params.id}/photo`}
          style={{textDecoration: 'none', display: 'block'}}
          className="bg-light">
          <SubmissionContainer className='text-dark'>
            <FaImage size="4em" />
            <h3>Photo</h3>
          </SubmissionContainer>
        </Link>
      </Col>
      <Col xs='12' sm='6' md='4'>
        <Link to={`/submit/${props.match.params.id}/video`}
          style={{textDecoration: 'none', display: 'block'}}
          className="bg-light">
          <SubmissionContainer className='text-dark'>
            <FaVideo size="4em" />
            <h3>Video</h3>
            <p>(YouTube or Vimeo)</p>
          </SubmissionContainer>
        </Link>
      </Col>
      <Col xs='12' md='4'>
        <Link to={`/submit/${props.match.params.id}/other`}
          style={{textDecoration: 'none', display: 'block'}}
          className="bg-light">
          <SubmissionContainer className='text-dark'>
            <FaBook size="4em" />
            <h3>Other</h3>
            <p>(eg. A book or physical art)</p>
          </SubmissionContainer>
        </Link>
      </Col>
    </Row>
  </Fragment>
)

export default SubmissionFormChooser
