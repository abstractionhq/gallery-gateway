import React, { Component } from 'react'
import { Form, FormGroup, Label, Button } from 'reactstrap'
import { Flex, Box } from 'rebass'
import { Field, reduxForm } from 'redux-form'

class CreateJudgeForm extends Component {
  submit = (values) => {
    const { create } = this.props

    create(values)
  }

  render () {
    const {
      handleSubmit
    } = this.props

    return (
      <Form onSubmit={handleSubmit(this.submit)} style={{marginBottom: '25px', marginTop: '25px'}}>
        <h3>Add Judge</h3>
        <Flex>
          <Box w={1/2}>
            <FormGroup>
              <Label for='username'>Username</Label>
              <Field id='username' component='input' type='text' name='username' className='form-control' />
            </FormGroup>
            <FormGroup>
              <Label for='firstName'>First Name</Label>
              <Field id='firstName' component='input' type='text' name='firstName' className='form-control' />
            </FormGroup>
            <FormGroup>
              <Label for='lastName'>Last Name</Label>
              <Field id='lastName' component='input' type='text' name='lastName' className='form-control' />
            </FormGroup>
            <Button type='submit' color='primary' style={{cursor: 'pointer'}}>Add</Button>
          </Box>
        </Flex>
      </Form>
    )
  }
}

export default reduxForm({
  form: 'createJudge'
})(CreateJudgeForm)
