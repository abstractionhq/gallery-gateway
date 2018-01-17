import React, { Component } from 'react'
import { Form, FormGroup, Label, Button, Row, Col } from 'reactstrap'
import { Field, reduxForm } from 'redux-form'

class CreateJudgeForm extends Component {
  submit = (values) => {
    const {
      create,
      reset
    } = this.props

    create(values)
      .then(() => reset()) // Clear the form after submitted
  }

  render () {
    const {
      handleSubmit
    } = this.props

    return (
      <Form onSubmit={handleSubmit(this.submit)}>
        <h3>Add New Judge</h3>
        <Row>
          <Col md='6' xs='12'>
            <FormGroup>
              <Label for='username'>Username</Label>
              <div className='input-group'>
                <Field id='username' component='input' type='text' name='username' className='form-control' required />
                <span className="input-group-addon">@rit.edu</span>
              </div>
            </FormGroup>
            <Row>
              <Col md='6' xs='12'>
                <FormGroup>
                  <Label for='firstName'>First Name</Label>
                  <Field id='firstName' component='input' type='text' name='firstName' className='form-control' required />
                </FormGroup>
              </Col>
              <Col md='6' xs='12'>
                <FormGroup>
                  <Label for='lastName'>Last Name</Label>
                  <Field id='lastName' component='input' type='text' name='lastName' className='form-control' required />
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>

        <Button type='submit' color='primary' style={{cursor: 'pointer'}}>Add</Button>
      </Form>
    )
  }
}

export default reduxForm({
  form: 'createJudge'
})(CreateJudgeForm)
