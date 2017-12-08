import React, { Component } from 'react'
import { Form, FormGroup, Label, Button } from 'reactstrap'
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

  renderFileUpload = () => {
    return (
      <Dropzone
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
    return (
      <Form>
        <FormGroup>
          <Label>Title</Label>
          <Field id='title' component='input' type='text' name='title' className='form-control' />
        </FormGroup>
        <FormGroup>
          <Label for='comment'>Artist Comment</Label>
          <Field id='comment' component='textarea' name='comment' rows={3} className='form-control' />
        </FormGroup>
        <FormGroup>
          <Label for='image'>Image</Label>
          <Field id='image' component={this.renderFileUpload} name='image' props={{previewImage: this.props.previewImage}} />
        </FormGroup>
        <Button type='submit' color='primary' style={{cursor: 'pointer'}}>Submit</Button>
      </Form>
    )
  }
}

export default reduxForm({
  form: 'makeEntry'
})(SubmissionForm)
