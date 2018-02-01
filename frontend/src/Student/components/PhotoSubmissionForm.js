import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Form, FormGroup, FormFeedback, Label, Button, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import { Formik, Field } from 'formik'
import yup from 'yup'

const Header = styled.h1`
  margin-bottom: 25px;
`

const PreviewImage = styled.img`
  height: 100%;
`

const ButtonContainer = styled.div`
  margin-top: 50px;
`

class PhotoSubmissionForm extends Component {
  static propTypes = {
    user: PropTypes.shape({
      username: PropTypes.string
    }).isRequired,
    handleUpload: PropTypes.func.isRequired,
    previewImage: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    done: PropTypes.func.isRequired
  }

  static defaultProps = {
    previewImage: {}
  }

  renderFileUpload = (field, form) => {
    const { name } = field
    const { setFieldValue } = form
    const {
      handleUpload,
      previewImage
    } = this.props

    return (
      <Dropzone
        name={name}
        accept='image/jpeg'
        multiple={false}
        style={{
          alignItems: 'center',
          cursor: 'pointer',
          display: 'flex',
          height: '250px',
          justifyContent: 'center',
          textAlign: 'center'
        }}
        activeStyle={{
          borderColor: '#6c6',
          backgroundColor: '#eee'
        }}
        rejectStyle={{
          borderColor: '#c66',
          backgroundColor: '#eee'
        }}
        className='form-control'
        onDrop={(acceptedFiles) => {
          const image = acceptedFiles[0] // Only 1 image per submission
          handleUpload(image).then(() => {
            // Need to use 'this.props' here to get the most up-to-date value – 'previewImage' above will be out-of-date
            setFieldValue(name, this.props.previewImage.path)
          })

          // TODO: If there was previously an image, and someone uploads a new image, send a delete request to the old image before uploading the new image
        }}
      >
        {previewImage.preview
          ? (<PreviewImage src={previewImage.preview} />)
          : (
            <span>
              <p>Click or drop to upload your file.</p>
              <p>Only *.jpg and *.jpeg images will be accepted.</p>
            </span>
          )}
      </Dropzone>
    )
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
          yearLevel: '',
          academicProgram: '',
          title: 'Untitled',
          comment: '',
          mediaType: '',
          horizDimInch: '',
          vertDimInch: '',
          forSale: 'no',
          moreCopies: 'no',
          path: ''
        }}
        validationSchema={
          yup.object()
            .shape({
              academicProgram: yup.string().required('Required'),
              yearLevel: yup.string().required('Required'),
              title: yup.string().required('Required'),
              comment: yup.string(),
              mediaType: yup.string().required('Required'),
              horizDimInch: yup.number().required('Required').positive('Width Must be Positive'),
              vertDimInch: yup.number().required('Required').positive('Height Must be Positive'),
              forSale: yup.string().required('Required').oneOf(['yes', 'no']), // Radio button values
              moreCopies: yup.string().required('Required').oneOf(['yes', 'no']), // Radio button values
              path: yup.string().required('Required')
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
            mediaType: values.mediaType,
            horizDimInch: values.horizDimInch,
            vertDimInch: values.vertDimInch,
            path: values.path
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
          <Form onSubmit={handleSubmit} style={{marginBottom: '75px'}}>
            <Row>
              <Col xs='12' md='8' style={{margin: '0 auto'}}>
                <Header>New Photo Submission</Header>
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
                  {/* TODO: Make this a Select w/ Input Element */}
                  <Label>Type of Media</Label>
                  <Field
                    type='text'
                    id='mediaType'
                    name='mediaType'
                    className='form-control'
                    required
                  />
                  {this.renderErrors(touched, errors, 'mediaType')}
                </FormGroup>
                <FormGroup>
                  <Label>Dimensions (inches)</Label>
                  <div className='input-group'>
                    <Label for='horizDimInch' hidden>Width</Label>
                    <Field
                      type='number'
                      id='horizDimInch'
                      name='horizDimInch'
                      className='form-control'
                      placeholder='width'
                      required
                      style={{ 'borderTopLeftRadius': '0.25rem', 'borderBottomLeftRadius': '0.25rem' }}
                    />
                    <div className='input-group-prepend input-group-append'>
                      <span className='input-group-text'>x</span>
                    </div>
                    <Label for='vertDimInch' hidden>Height</Label>
                    <Field
                      type='number'
                      id='vertDimInch'
                      name='vertDimInch'
                      className='form-control'
                      placeholder='height'
                      required
                    />
                  </div>
                  {this.renderErrors(touched, errors, 'horizDimInch')}
                  {this.renderErrors(touched, errors, 'vertDimInch')}
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
                        checked={values.forSale === 'no'}
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
                        checked={values.forSale === 'yes'}
                      />
                      <span className='ml-2'>Yes, I will sell my artwork.</span>
                    </Label>
                  </FormGroup>
                  {this.renderErrors(touched, errors, 'forSale')}
                </FormGroup>
                <FormGroup>
                  <Label>Will you print more copies of your artwork?</Label>
                  <FormGroup check>
                    <Label check>
                      <Field
                        type='radio'
                        id='moreCopies'
                        name='moreCopies'
                        value='no'
                        required
                        checked={values.moreCopies === 'no'}
                      />
                      <span className='ml-2'>No, I will not print more copies.</span>
                    </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Field
                        type='radio'
                        id='moreCopies'
                        name='moreCopies'
                        value='yes'
                        required
                        checked={values.moreCopies === 'yes'}
                      />
                      <span className='ml-2'>Yes, I will print more copies.</span>
                    </Label>
                  </FormGroup>
                  {this.renderErrors(touched, errors, 'moreCopies')}
                </FormGroup>
                <FormGroup>
                  <Label for='path'>Photo</Label>
                  <Field
                    id='path'
                    name='path'
                    render={({ field, form }) => this.renderFileUpload(field, form)}
                  />
                  {this.renderErrors(touched, errors, 'path')}
                </FormGroup>
                <ButtonContainer>
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
                </ButtonContainer>
              </Col>
            </Row>
          </Form>
        )}
      />
    )
  }
}

export default PhotoSubmissionForm
