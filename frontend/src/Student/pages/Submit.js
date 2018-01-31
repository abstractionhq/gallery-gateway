import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'
import styled from 'styled-components'

import SubmissionFormChooser from '../components/SubmissionFormChooser'
import PhotoSubmissionForm from '../containers/PhotoSubmissionForm'
import VideoSubmissionForm from '../containers/VideoSubmissionForm'
import OtherMediaSubmissionForm from '../containers/OtherMediaSubmissionForm'

const Header = styled.h1`
  margin-bottom: 25px;
`

const Submit = () => (
  <Container>
    <Header>New Submission</Header>
    <Switch>
      <Route exact path='/submit' component={SubmissionFormChooser} />
      <Route exact path='/submit/photo' component={PhotoSubmissionForm} />
      <Route exact path='/submit/video' component={VideoSubmissionForm} />
      <Route exact path='/submit/other' component={OtherMediaSubmissionForm} />
    </Switch>
  </Container>
)

export default Submit
