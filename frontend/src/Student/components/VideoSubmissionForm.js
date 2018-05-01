import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import {
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Button,
  Row,
  Col
} from 'reactstrap'
import styled from 'styled-components'
import { Formik, Field } from 'formik'
import yup from 'yup'

import SuccessModal from './SuccessModal'
import SubmitAsGroupRadio from './SubmitAsGroupRadio'
import Loading from '../../shared/components/Loading'

const Header = styled.h1`
  margin-bottom: 10px;
`

const SubHeader = styled.h3`
  margin-bottom: 25px;
`

const ButtonContainer = styled.div`
  margin-top: 50px;
`

class VideoSubmissionForm extends Component {
  static propTypes = {
    user: PropTypes.shape({
      username: PropTypes.string
    }).isRequired,
    data: PropTypes.shape({
      show: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        entries: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string,
            student: PropTypes.shape({
              username: PropTypes.string
            })
          })
        )
      })
    }).isRequired,
    create: PropTypes.func.isRequired,
    done: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      showModal: false
    }
  }

  componentDidUpdate () {
    if (this.props.data.error) {
      this.props.data.error.graphQLErrors.forEach(e => {
        this.props.handleError(e.message)
      })
    }
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

    // Otherwise, don't render anything
    return null
  }

  renderShow = () => {
    const { create, done, user, handleError } = this.props
    const forShow = {
      id: this.props.data.show.id,
      name: this.props.data.show.name
    }

    // calculate whether the user is beyond their single submissions
    const numSingleEntries = this.props.data.show.entries.reduce(
      // if 'student' is non-null, this is a single submission
      (n, entry) => (entry.student ? n + 1 : n),
      0
    )
    const canSubmitAsSingle = numSingleEntries < this.props.data.show.entryCap

    return (
      <Fragment>
        <Formik
          initialValues={{
            academicProgram: '',
            yearLevel: '',
            submittingAsGroup: canSubmitAsSingle ? 'no' : 'yes',
            groupParticipants: '',
            title: 'Untitled',
            comment: '',
            forSale: 'no',
            moreCopies: 'no',
            url: ''
          }}
          validationSchema={yup.object().shape({
            academicProgram: yup.string().required('Required'),
            yearLevel: yup.string().required('Required'),
            submittingAsGroup: yup
              .string()
              .required('Required')
              .oneOf(['yes', 'no']), // Radio button values
            groupParticipants: yup.string().when('submittingAsGroup', {
              is: 'yes',
              then: yup.string().required('Required')
            }),
            title: yup.string().required('Required'),
            comment: yup.string(),
            forSale: yup
              .string()
              .required('Required')
              .oneOf(['yes', 'no']), // Radio button values
            moreCopies: yup
              .string()
              .required('Required')
              .oneOf(['yes', 'no']), // Radio button values
            url: yup
              .string()
              .required('Required')
              .url('Must be a valid URL')
          })}
          onSubmit={values => {
            const input = {
              entry: {
                group:
                  values.submittingAsGroup === 'yes'
                    ? {
                      creatorUsername: user.username,
                      participants: values.groupParticipants
                    }
                    : null,
                studentUsername: user.username,
                showId: forShow.id,
                academicProgram: values.academicProgram,
                yearLevel: values.yearLevel,
                title: values.title,
                comment: values.comment,
                forSale: values.forSale === 'yes',
                // Must select 'forSale = yes' first
                // So, if you select 'forSale = yes', 'moreCopies = yes', 'forSale = no' => 'moreCopies' will be false
                moreCopies:
                  values.forSale === 'yes' && values.moreCopies === 'yes'
              },
              url: values.url
            }

            // Create an entry, show the success modal, and then go to the dashboard
            create(input)
              .then(() => {
                this.setState({ showModal: true }, () => {
                  setTimeout(done, 2000)
                })
              })
              .catch(err => handleError(err.message))
          }}
          render={({ values, errors, touched, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit} style={{ marginBottom: '75px' }}>
              <Row>
                <Col xs='12' md='8' style={{ margin: '0 auto' }}>
                  <Header>New Video Submission</Header>
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
                  <SubmitAsGroupRadio
                    values={values}
                    touched={touched}
                    errors={errors}
                    canSubmitAsSingle={canSubmitAsSingle}
                    renderErrors={this.renderErrors}
                  />
                  {values.submittingAsGroup === 'yes' ? (
                    <FormGroup>
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
                  ) : null}
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
                    <Label>
                      Is this work available for purchase if selected for a
                      purchase award?
                    </Label>
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
                  {values.forSale === 'yes' ? (
                    <FormGroup>
                      <Label>
                        If selected for multiple purchase awards, are you
                        willing to sell multiple copies?
                      </Label>
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
                  ) : null}
                  <ButtonContainer>
                    <Link to={`/submit?to=${forShow.id}`}>
                      <Button
                        type='button'
                        color='danger'
                        style={{ cursor: 'pointer', width: '150px' }}
                      >
                        Back
                      </Button>
                    </Link>
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

  render () {
    if (this.props.loading) {
      return <Loading />
    }
    if (this.props.data.show) {
      return this.renderShow()
    } else {
      return null
    }
  }
}

export default VideoSubmissionForm
