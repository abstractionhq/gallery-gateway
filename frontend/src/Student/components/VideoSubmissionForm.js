import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Form, FormGroup, FormFeedback, Label, Button, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import { Formik, Field } from 'formik'
import yup from 'yup'

const Header = styled.h1`
  margin-bottom: 25px;
`

class VideoSubmissionForm extends Component {
  static propTypes = {
    user: PropTypes.shape({
      username: PropTypes.string
    }).isRequired,
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
      done,
      user
    } = this.props

    return (
      <Formik
        initialValues={{
          academicProgram: '',
          yearLevel: '',
          title: 'Untitled',
          comment: '',
          forSale: '',
          moreCopies: '', // TODO: Do we need this for Videos?
          url: ''
        }}
        validationSchema={
          yup.object()
            .shape({
              academicProgram: yup.string().required('Required'),
              yearLevel: yup.string().required('Required'),
              title: yup.string().required('Required'),
              comment: yup.string(),
              forSale: yup.string().required('Required').oneOf(['yes', 'no']), // Radio button values
              moreCopies: yup.string().required('Required').oneOf(['yes', 'no']), // Radio button values
              url: yup.string().required('Required').url('Must be a valid URL')
            })}
        onSubmit={(
          values
        ) => {
          const input = {
            entry: {
              group: {
                name: '',
                creatorUsername: '',
                participants: ''
              },
              studentUsername: user.username,
              showId: 1, // TODO: Update to dynamic
              academicProgram: values.academicProgram,
              yearLevel: values.yearLevel,
              title: values.title,
              comment: values.comment,
              forSale: values.forSale === 'yes',
              moreCopies: values.moreCopies === 'yes'
            },
            url: values.url
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
              <Col xs='12' md='8' style={{margin: '0 auto'}}>
                <Header>New Video Submission</Header>
                <FormGroup>
                  <Label>Academic Program</Label>
                  <Field
                    type='text'
                    id='academicProgram'
                    name='academicProgram'
                    className='form-control'
                    required
                  />
                  {this.renderErrors(touched, errors, 'academicProgram')}
                </FormGroup>
                <FormGroup>
                  <Label>Year Level</Label>
                  <Field
                    type='text'
                    id='yearLevel'
                    name='yearLevel'
                    className='form-control'
                    required
                  />
                  {this.renderErrors(touched, errors, 'yearLevel')}
                </FormGroup>
                <FormGroup>
                  <Label>YouTube or Vimeo Video URL</Label>
                  <Field
                    type='url'
                    id='url'
                    name='url'
                    className='form-control'
                    placeholder='https://www.youtube.com/watch?v=dQw4w9WgXcQ'
                    required
                  />
                  {this.renderErrors(touched, errors, 'url')}
                </FormGroup>
                <FormGroup>
                  <Label>Title</Label>
                  <Field
                    type='text'
                    id='title'
                    name='title'
                    className='form-control'
                    required
                  />
                  {this.renderErrors(touched, errors, 'title')}
                </FormGroup>
                <FormGroup>
                  <Label for='comment'>Artist Comment</Label>
                  <Field
                    component='textarea'
                    id='comment'
                    name='comment'
                    className='form-control'
                    rows={4}
                  />
                  {this.renderErrors(touched, errors, 'comment')}
                </FormGroup>
                <FormGroup>
                  <Label>Will you sell your artwork?</Label>
                  <FormGroup check>
                    <Label check>
                      <Field
                        type='radio'
                        id='forSale'
                        name='forSale'
                        value='no'
                        required
                      />
                      <span className='ml-2'>No, I will not sell my artwork.</span>
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Field
                        type='radio'
                        id='forSale'
                        name='forSale'
                        value='yes'
                        required
                      />
                      <span className='ml-2'>Yes, I will sell my artwork.</span>
                    </Label>
                  </FormGroup>
                  {this.renderErrors(touched, errors, 'forSale')}
                </FormGroup>
                <Link to='/submit'>
                  <Button
                    type='button'
                    color='danger'
                    style={{cursor: 'pointer', width: '80px'}}
                  >
                    Back
                  </Button>
                </Link>
                <Button
                  type='submit'
                  color='primary'
                  style={{cursor: 'pointer', float: 'right', width: '80px'}}
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      />
    )
  }
}

export default VideoSubmissionForm
