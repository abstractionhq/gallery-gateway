import React from 'react'
import Status from '../../shared/containers/Status'
import { Container } from 'reactstrap'

import CreateShowForm from '../containers/CreateShowForm'

const CreateShow = () => (
  <Container>
    <h1>Create Show</h1>
    <CreateShowForm />
  </Container>
)

export default CreateShow
