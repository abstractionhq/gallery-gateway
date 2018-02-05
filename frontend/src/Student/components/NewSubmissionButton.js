import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Button, CardTitle, CardText, CardImg } from 'reactstrap'

const NewSubmissionButton = () => (
  <Card>
    <CardBody>
      <Button size="lg" block> Make a New Submission</Button>
    </CardBody>
  </Card>
)

export default NewSubmissionButton
