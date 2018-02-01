import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col } from 'reactstrap'
import styled from 'styled-components'

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
  border: 2px solid black;
  border-radius: 10px;
  margin-bottom: 25px;
  min-height: 250px;
  padding-top: 100px;
  text-align: center;
`

const SubmissionFormChooser = (props) => (
  <Fragment>
    <Header>What are you submitting?</Header>
    <Row>
      <Col xs='12' sm='6' md='4'>
        <Link to='/submit/photo' style={{textDecoration: 'none'}}>
          <SubmissionContainer className='bg-light text-dark'>
            <h3>Photo</h3>
          </SubmissionContainer>
        </Link>
      </Col>
      <Col xs='12' sm='6' md='4'>
        <Link to='/submit/video' style={{textDecoration: 'none'}}>
          <SubmissionContainer className='bg-light text-dark'>
            <h3>Video</h3>
            <p>(YouTube or Vimeo)</p>
          </SubmissionContainer>
        </Link>
      </Col>
      <Col xs='12' md='4'>
        <Link to='/submit/other' style={{textDecoration: 'none'}}>
          <SubmissionContainer className='bg-light text-dark'>
            <h3>Other</h3>
            <p>(eg. A book or physical object)</p>
          </SubmissionContainer>
        </Link>
      </Col>
    </Row>
  </Fragment>
)

export default SubmissionFormChooser
