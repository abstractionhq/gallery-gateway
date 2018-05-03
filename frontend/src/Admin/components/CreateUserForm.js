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

class CreateUserForm extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired,
    heading: PropTypes.string.isRequired
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
    const { create, handleError, heading } = this.props

    return (
      <Formik
        initialValues={{
          username: '',
          firstName: '',
          lastName: ''
        }}
        validationSchema={yup.object().shape({
          username: yup.string().required('Required'),
          firstName: yup.string().required('Required'),
          lastName: yup.string().required('Required')
        })}
        onSubmit={(values, { resetForm }) => {
          const input = {
            username: values.username.toLowerCase(),
            firstName: values.firstName,
            lastName: values.lastName
          }

          create(input)
            .then(resetForm()) // Clear the form after submitted
            .catch(err => handleError(err.message))
        }}
        render={({ values, errors, touched, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
            <h3>{heading}</h3>
            <Row>
              <Col md='6' xs='12'>
                <FormGroup>
                  <Label>Username</Label>
                  <div className='input-group'>
                    <Field
                      type='text'
                      id='username'
                      name='username'
                      className='form-control'
                      required
                    />
                    <div className='input-group-append'>
                      <span className='input-group-text'>@rit.edu</span>
                    </div>
                  </div>
                  {this.renderErrors(touched, errors, 'username')}
                </FormGroup>
                <Row>
                  <Col md='6' xs='12'>
                    <FormGroup>
                      <Label>First Name</Label>
                      <Field
                        type='text'
                        id='firstName'
                        name='firstName'
                        className='form-control'
                        required
                      />
                      {this.renderErrors(touched, errors, 'firstName')}
                    </FormGroup>
                  </Col>
                  <Col md='6' xs='12'>
                    <FormGroup>
                      <Label>Last Name</Label>
                      <Field
                        type='text'
                        id='lastName'
                        name='lastName'
                        className='form-control'
                        required
                      />
                      {this.renderErrors(touched, errors, 'lastName')}
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Button
              type='submit'
              color='primary'
              style={{
                cursor: 'pointer'
              }}
              disabled={isSubmitting}
            >
              Add
            </Button>
          </Form>
        )}
      />
    )
  }
}

export default CreateUserForm
