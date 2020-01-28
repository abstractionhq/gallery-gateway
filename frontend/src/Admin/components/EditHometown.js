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

class EditHometown extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired,
    student: PropTypes.shape({
      username: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      homeTown: PropTypes.string
    }).isRequired
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
    const { create, handleError, student } = this.props

    return (
      <Formik
        initialValues={{
          username: student.username,
          firstName: student.firstName,
          lastName: student.lastName,
          homeTown: student.homeTown || '',
          isEditing: 'no',
        }}
        validationSchema={yup.object().shape({
          username: yup.string().required('Required'),
          firstName: yup.string().required('Required'),
          lastName: yup.string().required('Required'),
          homeTown: yup.string().nullable()
        })}
        onSubmit={values => {
          const input = {
            username: values.username.toLowerCase(),
            firstName: values.firstName,
            lastName: values.lastName,
            homeTown: values.homeTown
          }

          create(input)
            .then(values.isEditing = 'no') //turn off edit mode
            .catch(err => handleError(err.message))
        }}
        render={({ values, errors, touched, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
           {values.submittingAsGroup === 'yes' ? (
            <Row>
              <Col>
                <Field
                    type='text'
                    id='homeTown'
                    name='homeTown'
                    className='form-control'
                  />
              </Col> 
              <Button
                type='submit'
                color='primary'
                style={{
                  cursor: 'pointer',
                  float: 'right',
                  width: '150px'
                }}
                disabled={isSubmitting}
              >
                Done
              </Button> 
            </Row>
           ):
            (
            <Row>
              <Col>{values.hometown}</Col> 
              <Col><div onClick={values.isEditing = values.isEditing == 'no' ? 'yes' : 'no'} style={ { }}>Edit</div></Col>
            </Row>
            )}
          </Form>
        )}
      />
    )
  }
}

export default EditHometown
