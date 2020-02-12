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
import Dropzone from 'react-dropzone'
import { Formik, Field } from 'formik'
import yup from 'yup'

import SuccessModal from './SuccessModal'
import SubmitAsGroupRadio from './SubmitAsGroupRadio'
import Loading from '../../shared/components/Loading'
import HomeTownInput from './HometownInput'
import DisplayNameInput from './DisplayNameInput'

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

class OtherSubmissionForm extends Component {
  static propTypes = {
    user: PropTypes.shape({
      username: PropTypes.string,
      hometown: PropTypes.string,
      displayName: PropTypes.string
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
    handleImageUpload: PropTypes.func.isRequired,
    handlePDFUpload: PropTypes.func.isRequired,
    previewFile: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    done: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired,
    clearPreview: PropTypes.func.isRequired
  }

  static defaultProps = {
    previewFile: {}
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

  componentDidUpdate () {
    if (this.props.data.error) {
      this.props.data.error.graphQLErrors.forEach(e => {
        this.props.handleError(e.message)
      })
    }
  }

  renderFileUpload = (field, form) => {
    const { name } = field
    const { setFieldValue } = form
    const { handleImageUpload, handlePDFUpload, previewFile } = this.props

    return (
      <Dropzone
        name={name}
        accept='application/pdf,image/jpeg'
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
        onDrop={acceptedFiles => {
          const file = acceptedFiles[0] // Only 1 file per submission

          switch (file.type) {
            case 'application/pdf':
              handlePDFUpload(file).then(() => {
                // Need to use 'this.props' here to get the most up-to-date value – 'previewFile' above will be out-of-date
                setFieldValue(name, this.props.previewFile.path)
              })
              break
            case 'image/jpeg':
              handleImageUpload(file).then(() => {
                // Need to use 'this.props' here to get the most up-to-date value – 'previewFile' above will be out-of-date
                setFieldValue(name, this.props.previewFile.path)
              })
              break
            default:
              console.error(`Unknown File Type: ${file.type}`)
          }
        }}
      >
        {previewFile.preview ? (
          <PreviewImage src={previewFile.preview} />
        ) : (
          <span>
            <p>Click or drop to upload your file.</p>
            <p>Only *.jpg, *.jpeg, and *.pdf files will be accepted.</p>
            <p>(50MB Maximum File Size)</p>
          </span>
        )}
      </Dropzone>
    )
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
    const { create, done, user, handleError, handleHometown, handleDisplayName } = this.props
    const forShow = {
      id: this.props.data.show.id,
      name: this.props.data.show.name
    }

    const defaultHometown = user.hometown || '';
    const hometownNeeded = !user.hometown;
    const defaultDisplayName = user.displayName || '';
    const displayNameNeeded = !user.displayName;

    // calculate whether the user is beyond their single submissions
    const numSingleEntries = this.props.data.show.entries.filter(e => !e.group).length
    const canSubmitAsSingle = numSingleEntries < this.props.data.show.entryCap

    return (
      <Fragment>
        <Formik
          initialValues={{
            academicProgram: "",
            yearLevel: "",
            submittingAsGroup: canSubmitAsSingle ? "no" : "yes",
            groupParticipants: "",
            title: "Untitled",
            comment: "",
            forSale: "no",
            moreCopies: "no",
            path: "",
            hometown: defaultHometown,
            displayName: defaultDisplayName
          }}
          validationSchema={yup.object().shape({
            academicProgram: yup.string().required("Required"),
            yearLevel: yup.string().required("Required"),
            submittingAsGroup: yup
              .string()
              .required("Required")
              .oneOf(["yes", "no"]), // Radio button values
            groupParticipants: yup.string().when("submittingAsGroup", {
              is: "yes",
              then: yup.string().required("Required")
            }),
            title: yup.string().required("Required"),
            comment: yup.string(),
            hometown: yup.string().when("submittingAsGroup", {
              is: "no",
              then: yup.string().required("Required")
            }),
            forSale: yup
              .string()
              .required("Required")
              .oneOf(["yes", "no"]), // Radio button values
            moreCopies: yup
              .string()
              .required("Required")
              .oneOf(["yes", "no"]), // Radio button values
            path: yup.string().required("Required")
          })}
          onSubmit={values => {
            const input = {
              entry: {
                group:
                  values.submittingAsGroup === "yes"
                    ? {
                        creatorUsername: user.username,
                        participants: values.groupParticipants
                      }
                    : null,
                displayName: values.displayName,
                hometown:
                  values.submittingAsGroup === "no" ? values.hometown : null,
                studentUsername:
                  values.submittingAsGroup === "no" ? user.username : null,
                showId: forShow.id,
                academicProgram: values.academicProgram,
                yearLevel: values.yearLevel,
                title: values.title,
                comment: values.comment,
                forSale: values.forSale === "yes",
                // Must select 'forSale = yes' first
                // So, if you select 'forSale = yes', 'moreCopies = yes', 'forSale = no' => 'moreCopies' will be false
                moreCopies:
                  values.forSale === "yes" && values.moreCopies === "yes"
              },
              path: values.path
            };

            // Create an entry, show the success modal, and then go to the dashboard
            create(input)
              .then(() => {
                if (values.submittingAsGroup == "no") {
                  handleHometown(values.hometown);
                }
              })
              .then(() => {
                handleDisplayName(values.displayName);
              })
              .then(() => {
                this.setState({ showModal: true }, () => {
                  setTimeout(done, 2000);
                });
              })
              .catch(err => handleError(err.message));
          }}
          render={({ values, errors, touched, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit} style={{ marginBottom: "75px" }}>
              <Row>
                <Col xs="12" md="8" style={{ margin: "0 auto" }}>
                  <Header>New Other Submission</Header>
                  <SubHeader>{forShow.name}</SubHeader>
                  <FormGroup>
                    <Label>Academic Program</Label>
                    <Field
                      type="text"
                      id="academicProgram"
                      name="academicProgram"
                      className="form-control"
                      required
                    />
                    {this.renderErrors(touched, errors, "academicProgram")}
                  </FormGroup>
                  <FormGroup>
                    <Label>Year Level</Label>
                    <Field
                      type="text"
                      id="yearLevel"
                      name="yearLevel"
                      className="form-control"
                      required
                    />
                    {this.renderErrors(touched, errors, "yearLevel")}
                  </FormGroup>
                  <SubmitAsGroupRadio
                    values={values}
                    touched={touched}
                    errors={errors}
                    canSubmitAsSingle={canSubmitAsSingle}
                    renderErrors={this.renderErrors}
                  />
                  {values.submittingAsGroup === "yes" ? (
                    <FormGroup>
                      <Label>List the names of your other group members.</Label>
                      <Field
                        type="text"
                        id="groupParticipants"
                        name="groupParticipants"
                        className="form-control"
                        required
                      />
                      {this.renderErrors(touched, errors, "groupParticipants")}
                    </FormGroup>
                  ) : null}
                  <FormGroup>
                    <Label>Title</Label>
                    <Field
                      type="text"
                      id="title"
                      name="title"
                      className="form-control"
                      required
                    />
                    {this.renderErrors(touched, errors, "title")}
                  </FormGroup>
                  <FormGroup>
                    <Label for="comment">Artist Comment (Optional)</Label>
                    <Field
                      component="textarea"
                      id="comment"
                      name="comment"
                      className="form-control"
                      rows={4}
                    />
                    {this.renderErrors(touched, errors, "comment")}
                  </FormGroup>
                  {values.submittingAsGroup === "no" ? (
                    <HomeTownInput
                      hometownNeeded={hometownNeeded}
                      values={values}
                      touched={touched}
                      errors={errors}
                      renderErrors={this.renderErrors}
                    />
                  ) : null}
                  <DisplayNameInput
                    displayNameNeeded={displayNameNeeded}
                    values={values}
                    touched={touched}
                    errors={errors}
                    renderErrors={this.renderErrors}
                  />
                  <FormGroup>
                    <Label>
                      Is this work available for purchase if selected for a
                      purchase award?
                    </Label>
                    <FormGroup check>
                      <Label check>
                        <Field
                          type="radio"
                          id="forSale"
                          name="forSale"
                          value="no"
                          required
                          checked={values.forSale === "no"}
                        />
                        <span className="ml-2">No</span>
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Field
                          type="radio"
                          id="forSale"
                          name="forSale"
                          value="yes"
                          required
                          checked={values.forSale === "yes"}
                        />
                        <span className="ml-2">Yes</span>
                      </Label>
                    </FormGroup>
                    {this.renderErrors(touched, errors, "forSale")}
                  </FormGroup>
                  {values.forSale === "yes" ? (
                    <FormGroup>
                      <Label>
                        If selected for multiple purchase awards, are you
                        willing to sell multiple copies?
                      </Label>
                      <FormGroup check>
                        <Label check>
                          <Field
                            type="radio"
                            id="moreCopies"
                            name="moreCopies"
                            value="no"
                            required
                            checked={values.moreCopies === "no"}
                          />
                          <span className="ml-2">No</span>
                        </Label>
                      </FormGroup>
                      <FormGroup check>
                        <Label check>
                          <Field
                            type="radio"
                            id="moreCopies"
                            name="moreCopies"
                            value="yes"
                            required
                            checked={values.moreCopies === "yes"}
                          />
                          <span className="ml-2">Yes</span>
                        </Label>
                      </FormGroup>
                      {this.renderErrors(touched, errors, "moreCopies")}
                    </FormGroup>
                  ) : null}
                  <FormGroup>
                    <Label for="path">File</Label>
                    <Field
                      id="path"
                      name="path"
                      render={({ field, form }) =>
                        this.renderFileUpload(field, form)
                      }
                    />
                    {this.renderErrors(touched, errors, "path")}
                  </FormGroup>
                  <ButtonContainer>
                    <Link to={`/submit?to=${forShow.id}`}>
                      <Button
                        type="button"
                        color="danger"
                        style={{ cursor: "pointer", width: "150px" }}
                      >
                        Back
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      color="primary"
                      style={{
                        cursor: "pointer",
                        float: "right",
                        width: "150px"
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
    );
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

export default OtherSubmissionForm
