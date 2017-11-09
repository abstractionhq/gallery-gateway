import React, { Component } from 'react'
import { Form, FormGroup, Label, Button } from 'reactstrap'
import { Flex, Box } from 'rebass'
import { Field, Fields, reduxForm } from 'redux-form'
import styled from 'styled-components'

import DateRangePicker from './DateRangePicker'

const CalendarContainer = styled.div`
  margin-bottom: 25px;

  .DateRangePicker {
    display: block;
  }
`

class CreateShowForm extends Component {
  submit = (values) => {
    const { create } = this.props

    create(values)
  }

  render () {
    const {
      handleSubmit
    } = this.props

    return (
      <Form onSubmit={handleSubmit(this.submit)}>
        {/* TODO: There should be client-side validation on these form fields */}
        <Flex>
          <Box w={1/2}>
            <FormGroup>
              <Label for='name'>Name</Label>
              <Field id='name' component='input' type='text' name='name' className='form-control' />
            </FormGroup>
            <FormGroup>
              <Label for='description'>Description</Label>
              <Field id='description' component='textarea' name='description' rows={3} className='form-control' />
            </FormGroup>
            <FormGroup>
              {/* TODO: Should validate positive */}
              <Label for='submission-limit'>Submission Limit</Label>
              <Field id='submission-limit' component='input' type='number' name='entryCap' className='form-control' />
            </FormGroup>
          </Box>
          <Box w={1/2}>
            <Flex column align='center'>
              <CalendarContainer>
                <Label>Submission Dates</Label>
                <Fields
                  names={['entryStart', 'entryEnd']}
                  component={props => (
                    <DateRangePicker
                      startDateFieldName='entryStart'
                      endDateFieldName='entryEnd'
                      {...props}
                    />
                  )}
                />
              </CalendarContainer>
              <CalendarContainer>
                <Label>Judging Dates</Label>
                <Fields
                  names={['judgingStart', 'judgingEnd']}
                  component={props => (
                    <DateRangePicker
                      startDateFieldName='judgingStart'
                      endDateFieldName='judgingEnd'
                      {...props}
                    />
                  )}
                />
              </CalendarContainer>
            </Flex>
          </Box>
        </Flex>
        <Button type='submit' color='primary' style={{cursor: 'pointer'}}>Submit</Button>
      </Form>
    )
  }
}

export default reduxForm({
  form: 'createShow',
  initialValues: {
    entryCap: 2
  }
})(CreateShowForm)
