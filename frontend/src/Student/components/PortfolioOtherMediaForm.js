import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Button,
  Row,
  Col
} from "reactstrap";
import styled from "styled-components";
import Dropzone from "react-dropzone";
import { Formik, Field } from "formik";
import yup from "yup";

import FormikSelectInput from "../../shared/components/FormikSelectInput";
import SuccessModal from "./SuccessModal";
import Loading from "../../shared/components/Loading";

const Header = styled.h1`
  margin-bottom: 10px;
`;

const SubHeader = styled.h3`
  margin-bottom: 25px;
`;

const PreviewImage = styled.img`
  height: 100%;
`;

const ButtonContainer = styled.div`
  margin-top: 50px;
`;

class PortfolioOtherMediaForm extends Component {
  static propTypes = {
    user: PropTypes.shape({
      username: PropTypes.string
    }).isRequired,
    data: PropTypes.shape({
      period: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        portfolio: PropTypes.shape({
          id: PropTypes.string,
          student: PropTypes.shape({
            username: PropTypes.string
          }),
          pieces: PropTypes.arrayOf(
            PropTypes.shape({
              id: PropTypes.string
            })
          )
        })
      }),
      error: PropTypes.object,
      loading: PropTypes.bool
    }).isRequired,
    handleImageUpload: PropTypes.func.isRequired,
    handlePDFUpload: PropTypes.func.isRequired,
    previewFile: PropTypes.object.isRequired,
    create: PropTypes.func.isRequired,
    done: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired,
    clearPreview: PropTypes.func.isRequired
  };

  static defaultProps = {
    previewImage: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
    // We clear any uploaded files.
    // This resets the field if a user uploads a file, navigates to another page,
    // and comes back to this form, or a user makes a submission and comes back to
    // this page to make another submission.
    props.clearPreview();
  }

  componentDidUpdate() {
    if (this.props.portfolioPeriod.error) {
      this.props.portfolioPeriod.error.graphQLErrors.forEach(e => {
        this.props.handleError(e.message);
      });
    }
    if (this.props.portfolio.error) {
      this.props.portfolio.error.graphQLErrors.forEach(e => {
        this.props.handleError(e.message);
      });
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
        <FormFeedback style={{ display: "block" }}>
          {errors[field]}
        </FormFeedback>
      );
    }

    // Otherwise, don't render anything
    return null;
  };

  renderShow = () => {
    const { create, done, user, handleError } = this.props;
    const forPortfolioPeriod = {
      id: this.props.portfolioPeriod.portfolioPeriod.id,
      name: this.props.portfolioPeriod.portfolioPeriod.name
    };
    const existingProgram = this.props.portfolio.portfolioByPeriod && this.props.portfolio.portfolioByPeriod.academicProgram;
    const existingYear =  this.props.portfolio.portfolioByPeriod && this.props.portfolio.portfolioByPeriod.yearLevel;
    return (
      <Fragment>
        <Formik
          initialValues={{
            academicProgram: existingProgram ? existingProgram : "",
            yearLevel: existingYear ? existingYear : "",
            title: "Untitled",
            comment: "",
            path: ""
          }}
          validationSchema={yup.object().shape({
            academicProgram: yup.string().required("Required"),
            yearLevel: yup.string().required("Required"),
            title: yup.string().required("Required"),
            comment: yup.string()
          })}
          onSubmit={values => {
            const portfolioId =
              this.props.portfolio.portfolioByPeriod
               && this.props.portfolio.portfolioByPeriod.id;
            const periodId =
              this.props.portfolioPeriod.portfolioPeriod &&
              this.props.portfolioPeriod.portfolioPeriod.id;
            const input = {
              piece: {
                portfolioId,
                title: values.title,
                comment: values.comment,
                studentUsername: user.username,
                periodId,
                academicProgram: values.academicProgram,
                yearLevel: values.yearLevel
              },
              path: values.path
            };
        
            // Create an entry, show the success modal, and then go to the dashboard
            create(input)
              .then(() => {
                this.setState({ showModal: true }, () => {
                  setTimeout(done, 2000);
                });
              })
              .catch(err => handleError(err.message));

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
            <Form onSubmit={handleSubmit} style={{ marginBottom: "75px" }}>
              <Row>
                <Col xs="12" md="8" style={{ margin: "0 auto" }}>
                  <Header>New Other Submission</Header>
                  <SubHeader>{forPortfolioPeriod.name}</SubHeader>
                  <FormGroup>
                    <Label>Academic Program</Label>
                    <Field
                      type="text"
                      id="academicProgram"
                      name="academicProgram"
                      className="form-control"
                      disabled = {!!existingProgram}
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
                      disabled = {!!existingYear}
                      required
                    />
                    {this.renderErrors(touched, errors, "yearLevel")}
                  </FormGroup>
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
                    <Link to={`/add?to=${forPortfolioPeriod.id}`}>
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
        <SuccessModal isOpen={this.state.showModal} type="portfolio"/>
      </Fragment>
    );
  };

  render() {
    if (this.props.loading) {
      return <Loading />;
    }
    if (this.props.portfolioPeriod.portfolioPeriod) {
      return this.renderShow();
    } else {
      return null;
    }
  }
}

export default PortfolioOtherMediaForm;
