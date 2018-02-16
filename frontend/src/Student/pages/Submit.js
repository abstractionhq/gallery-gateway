import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'
import { connect } from 'react-redux'

import SubmissionFormChooser from '../components/SubmissionFormChooser'
import PhotoSubmissionForm from '../containers/PhotoSubmissionForm'
import VideoSubmissionForm from '../containers/VideoSubmissionForm'
import OtherMediaSubmissionForm from '../containers/OtherMediaSubmissionForm'

const Submit = (props) => (
  <Container>
    <Switch>
      <Route exact path='/submit/:id' component={SubmissionFormChooser} />
      <Route exact path='/submit/:id/photo' component={PhotoSubmissionForm} />
      <Route exact path='/submit/:id/video' component={VideoSubmissionForm}/>
      <Route exact path='/submit/:id/other' component={OtherMediaSubmissionForm} />
    </Switch>
  </Container>
)



export default Submit
