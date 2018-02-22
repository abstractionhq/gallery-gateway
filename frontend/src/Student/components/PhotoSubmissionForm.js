import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Form, FormGroup, FormFeedback, Label, Button, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import { Formik, Field } from 'formik'
import yup from 'yup'

import FormikSelectInput from '../../shared/components/FormikSelectInput'
import SuccessModal from './SuccessModal'

const Header = styled.h1`
  margin-bottom: 10px;
`

const SubHeader = styled.h3`
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
    done: PropTypes.func.isRequired,
    clearPreview: PropTypes.func.isRequired
  }

  static defaultProps = {
    previewImage: {}
  }

  constructor (props) {
    super(props)
    this.state = {
      showModal: false
    }
    // We clear any uploaded files.
    // This resets the field if a user uploads a file, navigates to another page,
    // and comes back to this form, or a user makes a submission and comes back to
    // this page to make another submission.
    props.clearPreview()
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
    if(this.props.data.loading) {
      return null
    }
    const {
      create,
      done,
      user
    } = this.props
    const forShow = {id: this.props.data.show.id, name:this.props.data.show.name}
    return (
      <Fragment>
        <Formik
          initialValues={{
            academicProgram: '',
            yearLevel: '',
            submittingAsGroup: 'no',
            groupParticipants: '',
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
                submittingAsGroup: yup.string().required('Required').oneOf(['yes', 'no']), // Radio button values
                groupParticipants: yup.string()
                  .when('submittingAsGroup', {
                    is: 'yes',
                    then: yup.string().required('Required')
                  }),
                title: yup.string().required('Required'),
                comment: yup.string(),
                mediaType: yup.string().required('Required').nullable(), // react-select uses 'null' to represent when the value is cleared
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
                  creatorUsername: user.username,
                  participants: values.submittingAsGroup === 'yes' ? values.groupParticipants : ''
                },
                studentUsername: user.username,
                showId: forShow.id,
                academicProgram: values.academicProgram,
                yearLevel: values.yearLevel,
                title: values.title,
                comment: values.comment,
                forSale: values.forSale === 'yes',
                // Must select 'forSale = yes' first
                // So, if you select 'forSale = yes', 'moreCopies = yes', 'forSale = no' => 'moreCopies' will be false
                moreCopies: values.forSale === 'yes' && values.moreCopies === 'yes'
              },
              mediaType: values.mediaType,
              horizDimInch: values.horizDimInch,
              vertDimInch: values.vertDimInch,
              path: values.path
            }

            // Create an entry, show the success modal, and then go to the dashboard
            create(input)
              .then(() => {
                this.setState({showModal: true}, () => {
                  setTimeout(done, 2000)
                })
              })
              // TODO: Catch errors and display them to the user. Keep the form filled and don't redirect.
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
            <Form onSubmit={handleSubmit} style={{marginBottom: '75px'}}>
              <Row>
                <Col xs='12' md='8' style={{margin: '0 auto'}}>
                  <Header>New Photo Submission</Header>
                  <SubHeader>{forShow.name}</SubHeader>
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
                    <Label>Is this a group submission?</Label>
                    <FormGroup check>
                      <Label check>
                        <Field
                          type='radio'
                          id='submittingAsGroup'
                          name='submittingAsGroup'
                          value='no'
                          required
                          checked={values.submittingAsGroup === 'no'}
                        />
                        <span className='ml-2'>No</span>
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Field
                          type='radio'
                          id='submittingAsGroup'
                          name='submittingAsGroup'
                          value='yes'
                          required
                          checked={values.submittingAsGroup === 'yes'}
                        />
                        <span className='ml-2'>Yes</span>
                      </Label>
                    </FormGroup>
                    {this.renderErrors(touched, errors, 'submittingAsGroup')}
                  </FormGroup>
                  {values.submittingAsGroup === 'yes'
                    ? <FormGroup>
                      <Label>List the names of your other group members.</Label>
                      <Field
                        type='text'
                        id='groupParticipants'
                        name='groupParticipants'
                        className='form-control'
                        required
                      />
                      {this.renderErrors(touched, errors, 'groupParticipants')}
                    </FormGroup>
                    : null}
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
                    <Label for='comment'>Artist Comment (Optional)</Label>
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
                    <Label>Type of Media</Label>
                    <FormikSelectInput
                      id='mediaType'
                      name='mediaType'
                      field='mediaType'
                      input={{
                        onChange: setFieldValue,
                        onBlur: setFieldTouched,
                        value: values.mediaType
                      }}
                      options={[
                        {value: 'Chromogenic Print', label: 'Chromogenic Print'},
                        {value: 'Inkjet Print', label: 'Inkjet Print'}
                      ]}
                      placeholder={'Select or create option...'}
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
                    <Label>Is this work available for purchase if selected for a purchase award?</Label>
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
                        <span className='ml-2'>No</span>
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
                        <span className='ml-2'>Yes</span>
                      </Label>
                    </FormGroup>
                    {this.renderErrors(touched, errors, 'forSale')}
                  </FormGroup>
                  {values.forSale === 'yes'
                    ? <FormGroup>
                      <Label>If selected for multiple purchase awards, are you willing to sell multiple copies?</Label>
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
                          <span className='ml-2'>No</span>
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
                          <span className='ml-2'>Yes</span>
                        </Label>
                      </FormGroup>
                      {this.renderErrors(touched, errors, 'moreCopies')}
                    </FormGroup>
                    : null}
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
                    <Link to={`/submit?to=${forShow.id}`}>
                      <Button
                        type='button'
                        color='danger'
                        style={{cursor: 'pointer', width: '150px'}}
                      >
                        Back
                      </Button>
                    </Link>
                    <Button
                      type='submit'
                      color='primary'
                      style={{cursor: 'pointer', float: 'right', width: '150px'}}
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
        <SuccessModal isOpen={this.state.showModal} />
      </Fragment>
    )
  }
}

export default PhotoSubmissionForm
