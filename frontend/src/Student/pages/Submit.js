import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'
import { connect } from 'react-redux'

import SubmissionFormChooser from '../components/SubmissionFormChooser'
import PhotoSubmissionForm from '../containers/PhotoSubmissionForm'
import VideoSubmissionForm from '../containers/VideoSubmissionForm'
import OtherMediaSubmissionForm from '../containers/OtherMediaSubmissionForm'

const Submit = props => (
  <Container>
    <Switch>
      <Route exact path='/submit' component={SubmissionFormChooser} />
      <Route
        exact
        path='/submit/photo'
        render={() => <PhotoSubmissionForm forShow={props.forShow} />}
      />
      <Route
        exact
        path='/submit/video'
        render={() => <VideoSubmissionForm forShow={props.forShow} />}
      />
      <Route
        exact
        path='/submit/other'
        render={() => <OtherMediaSubmissionForm forShow={props.forShow} />}
      />
    </Switch>
  </Container>
)

const mapStateToProps = state => ({
  forShow: { id: 1, name: 'Honors Show 2017' } // TODO: Get from Redux
})

export default connect(mapStateToProps)(Submit)
