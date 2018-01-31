import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, FormGroup, FormFeedback, Label, Button, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import { Formik, Field } from 'formik'
import yup from 'yup'

class VideoSubmissionForm extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    done: PropTypes.func.isRequired
  }

  renderErrors = (touched, errors, field) => {
    // Render feedback if this field's been touched and has errors
    if (touched[field] && errors[field]) {
      return <FormFeedback style={{ display: 'block' }}>{errors[field]}</FormFeedback>
    }

    // Otherwise, don't render anything
    return null
  }

  render () {
    const {
      create,
      done
    } = this.props

    return (
      <Formik
        initialValues={{

        }}
        validationSchema={
          yup.object()
            .shape({

            })}
        onSubmit={(
          values
        ) => {
          const input = {

          }

          create(input).then(done())
          // TODO: Catch errors and display them to the user. Keep the form filled and don't redirect.
        }}
        render={({
          values,
          errors,
          touched,
          handleSubmit,
          isSubmitting
        }) => (
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md='6' xs='12'>

              </Col>
            </Row>
            <Button
              type='submit'
              color='primary'
              style={{cursor: 'pointer'}}
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </Form>
        )}
      />
    )
  }
}

export default VideoSubmissionForm
