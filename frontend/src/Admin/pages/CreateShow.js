import React, { Component } from 'react'
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap'

export default class CreateShow extends Component {
  render () {
    return (
      <Container>
        <h1>Create Show</h1>
        <Row>
          <Col>
            <Form>
              {/* TODO: There should be client-side validation on these form fields */}
              <FormGroup>
                <Label for='name' >Name</Label>
                <Input id='name' name='name' />
              </FormGroup>
              <FormGroup>
                <Label for='description'>Description</Label>
                <Input type='textarea' id='description' name='description' rows={3} />
              </FormGroup>
              <FormGroup>
                {/* TODO: Should validate positive */}
                <Label for='submission-limit'>Submission Limit</Label>
                <Input type='number' id='submission-limit' name='entry_cap' />
              </FormGroup>
              {/* TODO: Side-by-side fields for start/end ? */}
              <FormGroup>
                {/* TODO: Should validate the dates are after one another */}
                <Label for='submission-start'>Submission Starts</Label>
                <Input type='date' id='submission-start' name='submission_start' />
              </FormGroup>
              <FormGroup>
                <Label for='submission-end'>Submission Ends</Label>
                <Input type='date' id='submission-end' name='submission_end' />
              </FormGroup>
              <FormGroup>
                <Label for='judging-start'>Judging Starts</Label>
                <Input type='date' id='judging-start' name='judging_start' />
              </FormGroup>
              <FormGroup>
                <Label for='judging-end'>Judging Ends</Label>
                <Input type='date' id='judging-end' name='judging_end' />
              </FormGroup>

              {/* TODO: This currently reloads the page w/ the form contents as query-strings. This
                should instead intercept the submit action and send the data through a GraphQL mutation.
               */}
              <Button type='submit' color='primary'>Submit</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    )
  }
}
