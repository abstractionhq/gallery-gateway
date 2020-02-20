import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Button,
  Row,
  Col
} from 'reactstrap'
import { Formik, Field } from 'formik'
import yup from 'yup'
import styled from 'styled-components'
import moment from 'moment'
import  isAfterDay  from 'react-dates/src/utils/isAfterDay'

import FormikDateRangePicker from '../../shared/components/FormikDateRangePicker'

// Validates another date field is after this date field
// eg.
//   startDate: yup.date(),
//   endDate: yup.date().isAfter(yup.ref('startDate'), 'End Date must come after Start Date'),
yup.addMethod(yup.date, 'isAfter', function isAfter (ref, msg) {
  // Can't use arrow function because we rely on 'this' referencing yup's internals
  return this.test({
    name: 'isAfter',
    exclusive: true, // Validation errors don't stack
    // NOTE: Intentional use of single quotes - yup will handle the string interpolation
    // 'path' - yup provides this; key associated w/ yup schema
    // 'reference' - defined in params
    message: msg || '${path} must come after ${reference}', // eslint-disable-line no-template-curly-in-string
    params: {
      reference: ref.path
    },
    test (value) {
      return moment(value).isAfter(this.resolve(ref))
    }
  })
})

const CalendarContainer = styled.div`
  margin-bottom: 25px;
`

class EditShowForm extends Component {
  static propTypes = {
    show: PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      entryCap: PropTypes.number.isRequired
    }).isRequired,
    update: PropTypes.func.isRequired,
    done: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired
  }

  renderErrors = (touched, errors, field) => {
    // Render feedback if this field's been touched and has errors
    if (touched[field] && errors[field]) {
      return (
        <FormFeedback style={{ display: 'block' }}>
          {errors[field]}
        </FormFeedback>
      )
    }
  }

  render () {
    const { show, update, done, handleError } = this.props
    if(moment(show.entryStart).isAfter(moment())){
    return (
      <Formik
        initialValues={{
          name: show.name,
          description: show.description,
          entryCap: show.entryCap,
          entryStart: moment(show.entryStart),
          entryEnd: moment(show.entryEnd),
          judgingStart: moment(show.judgingStart),
          judgingEnd: moment(show.judgingEnd)
        }}
        validationSchema={yup.object().shape({
          name: yup.string().required('Required'),
          description: yup.string(),
          entryCap: yup
            .number()
            .integer('Must be an integer')
            .min(1, 'Must be at least 1')
            .required('Required'),
          entryStart: yup
            .date()
            .nullable()
            .required('Start Date is Required'),
          entryEnd: yup
            .date()
            .nullable()
            .isAfter(
              yup.ref('entryStart'),
              'Submission End Date must be after Submission Start Date'
            )
            .required('End Date is Required'),
          judgingStart: yup
            .date()
            .nullable()
            .isAfter(
              yup.ref('entryEnd'),
              'Judging Start Date must be after Submission End Date'
            )
            .required('Start Date is Required'),
          judgingEnd: yup
            .date()
            .nullable()
            .isAfter(
              yup.ref('judgingStart'),
              'Judging End Date must be after Judging Start Date'
            )
            .required('End Date is Required')
        })}
        onSubmit={values => {
          values.entryStart
          values.entryEnd
          values.judgingStart
          values.judgingEnd
          update(values)
            .then(() => done())
            .catch(err => handleError(err.message))
        }}
        render={({
          values,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
          handleSubmit,
          isSubmitting
        }) => (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col xs={6}>
                <FormGroup>
                  <Label>Name</Label>
                  <Field
                    type='text'
                    id='name'
                    name='name'
                    className='form-control'
                    required
                  />
                  {this.renderErrors(touched, errors, 'name')}
                </FormGroup>
                <FormGroup>
                  <Label>Description</Label>
                  <Field
                    component='textarea'
                    id='description'
                    name='description'
                    className='form-control'
                    rows={3}
                  />
                  {this.renderErrors(touched, errors, 'description')}
                </FormGroup>
                <FormGroup>
                  <Label>Individual Submission Limit</Label>
                  <Field
                    type='number'
                    min='1'
                    step='1'
                    id='entryCap'
                    name='entryCap'
                    className='form-control'
                    required
                  />
                  {this.renderErrors(touched, errors, 'entryCap')}
                </FormGroup>
              </Col>
              <Col xs={6}>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label>Submission Dates</Label>
                      <CalendarContainer>
                        <FormikDateRangePicker
                          isOutsideRange={day => !isAfterDay(day, moment())}
                          startDateField={{
                            field: 'entryStart',
                            input: {
                              onChange: setFieldValue,
                              onBlur: setFieldTouched,
                              value: values.entryStart
                            }
                          }}
                          endDateField={{
                            field: 'entryEnd',
                            input: {
                              onChange: setFieldValue,
                              onBlur: setFieldTouched,
                              value: values.entryEnd
                            }
                          }}
                          required
                        />
                        {this.renderErrors(touched, errors, 'entryStart')}
                        {this.renderErrors(touched, errors, 'entryEnd')}
                      </CalendarContainer>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label>Judging Dates</Label>
                      <CalendarContainer>
                        <FormikDateRangePicker
                          isOutsideRange={day => !isAfterDay(day, moment())}
                          startDateField={{
                            field: 'judgingStart',
                            input: {
                              onChange: setFieldValue,
                              onBlur: setFieldTouched,
                              value: values.judgingStart
                            }
                          }}
                          endDateField={{
                            field: 'judgingEnd',
                            input: {
                              onChange: setFieldValue,
                              onBlur: setFieldTouched,
                              value: values.judgingEnd
                            }
                          }}
                          required
                        />
                        {this.renderErrors(touched, errors, 'judgingStart')}
                        {this.renderErrors(touched, errors, 'judgingEnd')}
                      </CalendarContainer>
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                type='submit'
                color='primary'
                style={{
                  cursor: 'pointer'
                }}
                disabled={isSubmitting}
              >
                Save
              </Button>
              </Col>
              <Col>
                <Button
                    type='button'
                    color='danger'
                    className="float-right"
                    style={{
                      cursor: 'pointer'
                    }}
                    disabled={isSubmitting}
                    onClick={done}
                  >
                    Cancel
                  </Button>
              </Col>
            </Row>
          </Form>
        )}
      />
    )
  }
  else{
    return(
      <h2>Shows cannot be edited once the submission period has begun.</h2>
    )
  }
}
}

export default EditShowForm
