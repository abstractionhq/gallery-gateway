import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, FormGroup, FormFeedback, Label, Button, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import { Formik, Field } from 'formik'
import yup from 'yup'

const PreviewImage = styled.img`
  height: 100%;
`

class PhotoSubmissionForm extends Component {
  static propTypes = {
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
      done
    } = this.props

    return (
      <Formik
        initialValues={{
          title: 'Untitled',
          mediaType: '',
          comment: '',
          horizDimInch: '',
          vertDimInch: '',
          forSale: '',
          path: ''
        }}
        validationSchema={
          yup.object()
            .shape({
              title: yup.string().required('Required'),
              mediaType: yup.string().required('Required'),
              comment: yup.string(),
              horizDimInch: yup.number().required('Required').positive('Width Must be Positive'),
              vertDimInch: yup.number().required('Required').positive('Height Must be Positive'),
              forSale: yup.string().required('Required').oneOf(['yes', 'no']), // Radio button values
              path: yup.string().required('Required')
            })}
        onSubmit={(
          values
        ) => {
          const input = {
            entry: {
              // groupId: ''
              // studentUsername: ''
              showId: 1, // TODO: Update to dynamic
              title: values.title,
              comment: values.comment,
              forSale: values.forSale === 'yes'
              // yearLevel: '',
              // academicProgram: '',
              // moreCopies: ''
            },
            path: values.path,
            horizDimInch: values.horizDimInch,
            vertDimInch: values.vertDimInch,
            mediaType: values.mediaType
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
              </Col>
              <Col md='6' xs='12'>
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
              </Col>
            </Row>
            <FormGroup>
              <Label for='path'>Image</Label>
              <Field
                id='path'
                name='path'
                render={({ field, form }) => this.renderFileUpload(field, form)}
              />
            </FormGroup>
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

export default PhotoSubmissionForm
