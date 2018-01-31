import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'

import PhotoSubmissionForm from '../containers/PhotoSubmissionForm'
import VideoSubmissionForm from '../components/VideoSubmissionForm'
import OtherSubmissionForm from '../components/OtherSubmissionForm'

const renderChooser = () => {
  return (
    <div>What Type of Submission?</div> // TODO
  )
}

const Submit = () => (
  <Container>
    <Row>
      <Col>
        <h1>New Submission</h1>
        <Switch>
          <Route exact path='/submit' render={renderChooser} />
          <Route exact path='/submit/photo' component={PhotoSubmissionForm} />
          <Route exact path='/submit/video' component={VideoSubmissionForm} />
          <Route exact path='/submit/other' component={OtherSubmissionForm} />
        </Switch>
      </Col>
    </Row>
  </Container>
)

export default Submit
