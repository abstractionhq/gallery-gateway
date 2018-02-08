import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Button, CardTitle } from 'reactstrap'

const NewSubmissionStyle = styled.div`
   display: flex;
   flex-direction: column;
   justify-content: center;
`

const NewSubmissionButton = () => (
  <NewSubmissionStyle>
    <Card>
      <CardBody>
        <Button size="lg" block> Make a New Submission</Button>
      </CardBody>
    </Card>
  </NewSubmissionStyle>
)

export default NewSubmissionButton
