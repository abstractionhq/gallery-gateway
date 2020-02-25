import React, { Fragment, Component } from "react";
import PropTypes from 'prop-types'
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

class ScholarshipForm extends Component {
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
  };

  static defaultProps = {
    previewFile: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  componentDidUpdate() {
    if (this.props.data.error) {
      this.props.data.error.graphQLErrors.forEach(e => {
        this.props.handleError(e.message);
      });
    }
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

  renderForm = () => {
    return (
      <Fragment>
        <Formik
          initialValues={{
            name: "",
            gpa: "",
            yearStatus: "",
            requiredPhotos: "no",
            description: "",
            fulltime: "",
            renewable: "",
            requiresEssay: "",
            degreePrograms: ""
          }}
          validationSchema={yup.object().shape({
            name: yup.string().required("Required"),
            gpa: yup.string(),
            yearStatus: yup.string(),
            requiredPhotos: yup.number().required("Required"),
            description: yup.string().required("Required"),
            fulltime: yup.string().required("Required"),
            renewable: yup.string().required("Required"),
            requiresEssay: yup.string().required("Required"),
            degreePrograms: yup.string()
          })}
          onSubmit={values => {
            const input = {
              entry: {},
              path: values.path
            };
          }}
          render={({ values, errors, touched, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit} style={{ marginBottom: "75px" }}>
              <Row>
                <Col xs="12" md="8" style={{ margin: "0 auto" }}>
                  {/* <Header>New Other Submission</Header> */}
                  {/* <SubHeader>{forShow.name}</SubHeader> */}
                  <FormGroup>
                    <Label>Scholarship Name</Label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={this.props.name}
                      required
                    />
                    {this.renderErrors(touched, errors, "name")}
                  </FormGroup>
                  <FormGroup>
                    <Label>Minimum GPA</Label>
                    <Field
                      type="number"
                      step="0.1"
                      min="0"
                      max="4"
                      placeholder="3.0"
                      id="gpa"
                      name="gpa"
                      className="form-control"
                      value={this.props.gpa}
                    />
                    {this.renderErrors(touched, errors, "gpa")}
                  </FormGroup>
                  <FormGroup>
                    <Label>Year Status Required</Label>
                    <Field
                      type="text"
                      id="yearStatus"
                      name="yearStatus"
                      className="form-control"
                      value={this.props.yearStatus}
                    />
                    {this.renderErrors(touched, errors, "yearStatus")}
                  </FormGroup>
                  <FormGroup>
                    <Label>Number of Photos Required</Label>
                    <Field
                      type="number"
                      step="1"
                      min="1"
                      id="requiredPhotos"
                      name="requiredPhotos"
                      className="form-control"
                      value={this.props.requiredPhotos}
                      required
                    />
                    {this.renderErrors(touched, errors, "requiredPhotos")}
                  </FormGroup>
                  <FormGroup>
                    <Label for="comment">Description</Label>
                    <Field
                      component="textarea"
                      id="description"
                      name="description"
                      className="form-control"
                      rows={4}
                      value={this.props.description}
                      required
                    />
                    {this.renderErrors(touched, errors, "description")}
                  </FormGroup>
                  <FormGroup>
                    <Label>Full-time Status Required?</Label>
                    <FormGroup check>
                      <Label check>
                        <Field
                          type="radio"
                          id="fulltime"
                          name="fulltime"
                          value={this.props.fulltime}
                          required
                          checked={values.fulltime === "no"}
                        />
                        <span className="ml-2">No</span>
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Field
                          type="radio"
                          id="fulltime"
                          name="fulltime"
                          value={this.props.fulltime}
                          required
                          checked={values.fulltime === "yes"}
                        />
                        <span className="ml-2">No</span>
                      </Label>
                    </FormGroup>
                    {this.renderErrors(touched, errors, "fulltime")}
                  </FormGroup>
                  <FormGroup>
                    <Label>Scholarship is Renewable?</Label>
                    <FormGroup check>
                      <Label check>
                        <Field
                          type="radio"
                          id="renewable"
                          name="renewable"
                          value={this.props.renewable}
                          required
                          checked={values.renewable === "no"}
                        />
                        <span className="ml-2">No</span>
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Field
                          type="radio"
                          id="renewable"
                          name="renewable"
                          value={this.props.renewable}
                          required
                          checked={values.renewable === "yes"}
                        />
                        <span className="ml-2">No</span>
                      </Label>
                    </FormGroup>
                    {this.renderErrors(touched, errors, "renewable")}
                  </FormGroup>
                  <FormGroup>
                    <Label>Is an essay required?</Label>
                    <FormGroup check>
                      <Label check>
                        <Field
                          type="radio"
                          id="essayRequired"
                          name="essayRequired"
                          value={this.props.essayRequired}
                          required
                          checked={values.essayRequired === "no"}
                        />
                        <span className="ml-2">No</span>
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Field
                          type="radio"
                          id="essayRequired"
                          name="essayRequired"
                          value={this.props.essayRequired}
                          required
                          checked={values.essayRequired === "yes"}
                        />
                        <span className="ml-2">No</span>
                      </Label>
                    </FormGroup>
                    {this.renderErrors(touched, errors, "essayRequired")}
                  </FormGroup>
                  <FormGroup>
                    <Label>Degree Programs Required</Label>
                    <Field
                      type="text"
                      id="degreePrograms"
                      name="degreePrograms"
                      className="form-control"
                      value={this.props.degreePrograms}
                    />
                    {this.renderErrors(touched, errors, "degreePrograms")}
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          )}
        />
      </Fragment>
    );
  };

  render() {
    return this.renderForm();
  }
}

export default ScholarshipForm;