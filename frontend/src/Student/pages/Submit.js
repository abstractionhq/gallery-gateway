import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'

import SubmissionFormChooser from '../components/SubmissionFormChooser'
import PhotoSubmissionForm from '../containers/PhotoSubmissionForm'
import VideoSubmissionForm from '../containers/VideoSubmissionForm'
import OtherMediaSubmissionForm from '../containers/OtherMediaSubmissionForm'

const addIdPropFromQueryParams = () => {
  return window.location.search.split('=')[1]
}

const Submit = (props) => (
  <Container>
    <Switch>
      <Route exact path='/submit' render={() => <SubmissionFormChooser id={addIdPropFromQueryParams()} /> }/>
      <Route exact path='/submit/photo' render={() => <PhotoSubmissionForm id={addIdPropFromQueryParams()} /> }/>
      <Route exact path='/submit/video' render={() => <VideoSubmissionForm id={addIdPropFromQueryParams()} /> }/>
      <Route exact path='/submit/other' render={() => <OtherMediaSubmissionForm id={addIdPropFromQueryParams()} /> }/>
    </Switch>
  </Container>
)



export default Submit
