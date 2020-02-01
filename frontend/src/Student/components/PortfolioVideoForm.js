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

class PortfolioVideoForm extends Component {
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
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  componentDidUpdate () {
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
            url: ''
          }}
          validationSchema={yup.object().shape({
            academicProgram: yup.string().required("Required"),
            yearLevel: yup.string().required("Required"),
            title: yup.string().required("Required"),
            comment: yup.string(),
            url: yup
              .string()
              .required('Required')
              .url('Must be a valid URL')
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
              url: values.url
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
            handleSubmit,
            isSubmitting
          }) => (
            <Form onSubmit={handleSubmit} style={{ marginBottom: "75px" }}>
              <Row>
                <Col xs="12" md="8" style={{ margin: "0 auto" }}>
                  <Header>New Video Submission</Header>
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
        <SuccessModal isOpen={this.state.showModal} type="portfolio" />
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

export default PortfolioVideoForm;
