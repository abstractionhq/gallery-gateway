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
      hometown: PropTypes.string
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
          hometown: student.hometown,
          isEditing: 'no',
        }}
        validationSchema={yup.object().shape({
          username: yup.string().required('Required'),
          firstName: yup.string().required('Required'),
          lastName: yup.string().required('Required'),
          hometown: yup.string().nullable()
        })}
        onSubmit={values => {
          const input = {
            username: values.username.toLowerCase(),
            firstName: values.firstName,
            lastName: values.lastName,
            hometown: values.hometown
          }

          create(input)
            .then(values.isEditing = 'no').then(this.forceUpdate()) //turn off edit mode
            .catch(err => handleError(err.message))
        }}
        render={({ values, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit}>
           {values.isEditing == 'yes' ? (
            <Row>
              <Col>        
                <Field
                    style={{
                      width: '10em'
                    }}
                    type='text'
                    id='hometown'
                    name='hometown'
                    className='form-control'
                  />
              </Col> 
              <Button 
                className='mr-4'
                type='submit'
              >
                Done
              </Button> 
            </Row>
           ):
            (
            <Row>
              <Col>{values.hometown}</Col> 
              <Col><Button onClick = {()=>{
                values.isEditing = 'yes'
                this.forceUpdate()
                }}>Edit</Button></Col>
            </Row>
            )}
          </Form>
        )}
      />
    )
  }
}

export default EditHometown
