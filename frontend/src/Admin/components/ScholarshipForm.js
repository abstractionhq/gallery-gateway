import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Button,
  Row,
  Col
} from 'reactstrap'
import { Formik, Field } from 'formik'
import yup from 'yup'

class ScholarshipForm extends Component {
  static propTypes = {
    create: PropTypes.func.isRequired,
    done: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired
  };

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
  };

  render () {
    const { create, done, handleError } = this.props
    return (
      <Fragment>
        <Formik
          initialValues={{
            name: '',
            gpa: '',
            yearStatus: '',
            requiredPhotos: '',
            description: '',
            fulltime: '',
            renewable: '',
            requiresEssay: '',
            degreePrograms: ''
          }}
          validationSchema={yup.object().shape({
            name: yup.string().required('Required'),
            gpa: yup.string(),
            yearStatus: yup.string(),
            requiredPhotos: yup.number().required('Required'),
            description: yup.string().required('Required'),
            fulltime: yup.string().required('Required'),
            renewable: yup.string().required('Required'),
            requiresEssay: yup.string().required('Required'),
            degreePrograms: yup.string()
          })}
          onSubmit={values => {
            create(values)
              .then(() => done())
              .catch(err => handleError(err.message))
          }}
          render={({ values, errors, touched, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit} style={{ marginBottom: '75px' }}>
              <Row>
                <Col xs="12" md="8" style={{ margin: '0 auto' }}>
                  <FormGroup>
                    <Label>Scholarship Name</Label>
                    <Field
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      // value={this.props.name}
                      required
                    />
                    {this.renderErrors(touched, errors, 'name')}
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
                      // value={this.props.gpa}
                    />
                    {this.renderErrors(touched, errors, 'gpa')}
                  </FormGroup>
                  <FormGroup>
                    <Label>Year Status Required</Label>
                    <Field
                      type="text"
                      id="yearStatus"
                      name="yearStatus"
                      className="form-control"
                      // value={this.props.yearStatus}
                    />
                    {this.renderErrors(touched, errors, 'yearStatus')}
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
                      // value={this.props.requiredPhotos}
                      required
                    />
                    {this.renderErrors(touched, errors, 'requiredPhotos')}
                  </FormGroup>
                  <FormGroup>
                    <Label for="comment">Description</Label>
                    <Field
                      component="textarea"
                      id="description"
                      name="description"
                      className="form-control"
                      rows={4}
                      // value={this.props.description}
                      required
                    />
                    {this.renderErrors(touched, errors, 'description')}
                  </FormGroup>
                  <FormGroup>
                    <Label>Full-time Status Required?</Label>
                    <FormGroup check>
                      <Label check>
                        <Field
                          type="radio"
                          id="fulltime"
                          name="fulltime"
                          value="no"
                          required
                          checked={values.fulltime === 'no'}
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
                          value="yes"
                          required
                          checked={values.fulltime === 'yes'}
                        />
                        <span className="ml-2">Yes</span>
                      </Label>
                    </FormGroup>
                    {this.renderErrors(touched, errors, 'fulltime')}
                  </FormGroup>
                  <FormGroup>
                    <Label>Scholarship is Renewable?</Label>
                    <FormGroup check>
                      <Label check>
                        <Field
                          type="radio"
                          id="renewable"
                          name="renewable"
                          value="no"
                          required
                          checked={values.renewable === 'no'}
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
                          value="yes"
                          required
                          checked={values.renewable === 'yes'}
                        />
                        <span className="ml-2">Yes</span>
                      </Label>
                    </FormGroup>
                    {this.renderErrors(touched, errors, 'renewable')}
                  </FormGroup>
                  <FormGroup>
                    <Label>Is an essay required?</Label>
                    <FormGroup check>
                      <Label check>
                        <Field
                          type="radio"
                          id="requiresEssay"
                          name="requiresEssay"
                          value="no"
                          required
                          checked={values.requiresEssay === 'no'}
                        />
                        <span className="ml-2">No</span>
                      </Label>
                    </FormGroup>
                    <FormGroup check>
                      <Label check>
                        <Field
                          type="radio"
                          id="requiresEssay"
                          name="requiresEssay"
                          value="yes"
                          required
                          checked={values.requiresEssay === 'yes'}
                        />
                        <span className="ml-2">Yes</span>
                      </Label>
                    </FormGroup>
                    {this.renderErrors(touched, errors, 'requiresEssay')}
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
                    {this.renderErrors(touched, errors, 'degreePrograms')}
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    type='submit'
                    color='primary'
                    style={{cursor: 'pointer'}}
                    disabled={isSubmitting}
                  >
                    <span>Create</span>
                  </Button>
                </Col>
                <Col>
                  <Button
                    type='button'
                    color='danger'
                    className="float-right"
                    style={{cursor: 'pointer'}}
                    disabled={isSubmitting}
                    onClick={done}
                  >
                    <span>Cancel</span>
                  </Button>
                </Col>
              </Row>

            </Form>
          )}
        />
      </Fragment>
    )
  };
}

export default ScholarshipForm
