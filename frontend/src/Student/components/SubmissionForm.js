import React, { Component } from 'react'
import { Form, FormGroup, Label, Button, Row, Col } from 'reactstrap'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import Dropzone from 'react-dropzone'
import styled from 'styled-components'

const PreviewImage = styled.img`
  height: 100%;
`

class SubmissionForm extends Component {
  static propTypes = {
    handleUpload: PropTypes.func.isRequired,
    previewImage: PropTypes.object.isRequired
  }

  static defaultProps = {
    previewImage: {}
  }

  submit = (values) => {
    const {
      create,
      done
    } = this.props

    const input = {
      entry: {
        // groupId: ''
        // studentUsername: ''
        showId: 1, // TODO: Update to dynamic
        title: values.title,
        comment: values.comment,
        forSale: values.forSale === 'true'
        // yearLevel: '',
        // academicProgram: '',
        // moreCopies: ''
      },
      path: values.path,
      horizDimInch: values.horizDimInch,
      vertDimInch: values.vertDimInch,
      mediaType: values.mediaType
    }

    create(input)
      .then(done())
      // TODO: Catch errors and display them to the user. Keep the form filled and don't redirect.
  }

  renderFileUpload = (field) => {
    return (
      <Dropzone
        name={field.name}
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
          // NOTE: 'this' is SubmissionForm
          this.props.handleUpload(image)
            .then(() => {
              field.input.onChange(this.props.previewImage.path)
            })
        }}
      >
        {/* NOTE: 'this' is Field */}
        {this.props.previewImage.preview
          ? (
            <PreviewImage src={this.props.previewImage.preview} />
          )
          : (
            <span>
              <p>Click or drop to upload your file.</p>
              <p>Only *.jpg and *.jpeg images will be accepted.</p>
            </span>
          )}
      </Dropzone>
    )
  }

  render () {
    const {
      handleSubmit
    } = this.props

    return (
      <Form onSubmit={handleSubmit(this.submit)}>
        <Row>
          <Col md='6' xs='12'>
            <FormGroup>
              <Label>Title</Label>
              <Field id='title' component='input' type='text' name='title' className='form-control' />
            </FormGroup>
            <FormGroup>
              <Label>Media Type</Label>
              <Field id='mediaType' component='input' type='text' name='mediaType' className='form-control' />
            </FormGroup>
          </Col>
          <Col md='6' xs='12'>
            <FormGroup>
              <Label for='comment'>Artist Comment</Label>
              <Field id='comment' component='textarea' name='comment' rows={4} className='form-control' />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md='6' xs='12'>
            <FormGroup>
              <Label>Dimensions (inches)</Label>
              <div className='input-group'>
                <Label for='horizDimInch' hidden>Width</Label>
                <Field id='horizDimInch' component='input' type='number' name='horizDimInch' className='form-control' placeholder='width' required />
                <span className="input-group-addon">x</span>
                <Label for='vertDimInch' hidden>Height</Label>
                <Field id='vertDimInch' component='input' type='number' name='vertDimInch' className='form-control' placeholder='height' required />
              </div>
            </FormGroup>
            <FormGroup>
              <Label>Will you sell your artwork?</Label>
              <FormGroup check>
                <Label check>
                  <Field component='input' type='radio' name='forSale' value='false' />
                  <span className='ml-2'>No, I will not sell my artwork.</span>
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Field component='input' type='radio' name='forSale' value='true' />
                  <span className='ml-2'>Yes, I will sell my artwork.</span>
                </Label>
              </FormGroup>
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for='image'>Image</Label>
          <Field id='image' component={this.renderFileUpload} name='path' props={{previewImage: this.props.previewImage}} />
        </FormGroup>

        <Button type='submit' color='primary' style={{cursor: 'pointer'}}>Submit</Button>
      </Form>
    )
  }
}

export default reduxForm({
  form: 'makeEntry',
  initialValues: {
    title: 'Untitled',
    forSale: 'false'
  }
})(SubmissionForm)
