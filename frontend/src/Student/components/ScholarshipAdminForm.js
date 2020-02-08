import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Form,
    FormGroup,
    FormFeedback,
    Label,
    Button,
    Row,
    Col } from 'reactstrap'
import styled from 'styled-components'
import Dropzone from 'react-dropzone'
import { Formik, Field } from 'formik'
import yup from 'yup'

const ScholarshipAdminForm = props => (
    <Form onSubmit={handleSubmit} style={{ marginBottom: '75px' }}>
        <Row>
            <Col xs='12' md='8' style={{ margin: '0 auto' }}>
                {/* <Header>New Other Submission</Header> */}
                {/* <SubHeader>{forShow.name}</SubHeader> */}
                  <FormGroup>
                    <Label>Scholarship Name</Label>
                    <Field
                      type='text'
                      id='scholarshipName'
                      name='scholarshipName'
                      className='form-control'
                      //value =''
                      required
                    />
                    {this.renderErrors(touched, errors, 'scholarshipName')}
                  </FormGroup>
                  <FormGroup>
                    <Label>Scholarship Name</Label>
                    <Field
                      type='text'
                      id='scholarshipName'
                      name='scholarshipName'
                      className='form-control'
                    //value=''
                      required
                    />
                    {this.renderErrors(touched, errors, 'scholarshipName')}
                  </FormGroup>
                  <FormGroup>
                    <Label>Number of Photos Required</Label>
                    <Field
                      type='number'
                      step='1'
                      min='1'
                      id='photosRequired'
                      name='photosRequired'
                      className='form-control'
                    //value=''
                      required
                    />
                    {this.renderErrors(touched, errors, 'photosRequired')}
                  </FormGroup>
                  <FormGroup>
                    <Label>Minimum GPA</Label>
                    <Field
                      type='number'
                      step='0.2'
                      min='0'
                      max='4'
                      placeholder='3.0'
                      id='minGPA'
                      name='minGPA'
                      className='form-control'
                      //value=''
                      required
                    />
                    {this.renderErrors(touched, errors, 'minGPA')}
                  </FormGroup>
                  <FormGroup>
                    <Label>Year Status Required</Label>
                    <Field
                      type='text'
                      id='yearStatus'
                      name='yearStatus'
                      className='form-control'
                      value=''
                      required
                    />
                    {this.renderErrors(touched, errors, 'yearStatus')}
                  </FormGroup>
                  <FormGroup>
                    <Label>Full-time Status Required? </Label>
                    <Field
                      type='checkbox'
                      id='fulltime'
                      name='fulltime'
                      className='form-control'
                      //value=''
                      required
                    />
                    {this.renderErrors(touched, errors, 'fulltime')}
                  </FormGroup>
                  <FormGroup>
                    <Label>Full-time Status Required? </Label>
                    <Field
                      type='checkbox'
                      id='fulltime'
                      name='fulltime'
                      className='form-control'
                      //value=''
                      required
                    />
                    {this.renderErrors(touched, errors, 'fulltime')}
                  </FormGroup>
                  <FormGroup>
                    <Label>Scholarship is Renewable? </Label>
                    <Field
                      type='checkbox'
                      id='renewable'
                      name='renewable'
                      className='form-control'
                      //value=''
                      required
                    />
                    {this.renderErrors(touched, errors, 'renewable')}
                  </FormGroup>
                  <FormGroup>
                    <Label>Is an essay required? </Label>
                    <Field
                      type='checkbox'
                      id='essay'
                      name='essay'
                      className='form-control'
                      //value=''
                      required
                    />
                    {this.renderErrors(touched, errors, 'essay')}
                  </FormGroup>
                  <FormGroup>
                    <Label for='comment'>Description</Label>
                    <Field
                      component='textarea'
                      id='description'
                      name='description'
                      className='form-control'
                      rows={4}
                      //value=''
                      required
                    />
                    {this.renderErrors(touched, errors, 'description')}
                  </FormGroup>
            </Col>
        </Row>
    </Form>
)