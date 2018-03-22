import React, { Component } from 'react'
import { Alert } from 'reactstrap'
import { connect } from 'react-redux'
import { dismissError } from '../actions'

class ErrorMessage extends Component {
  render () {
    return (
      <Alert color="danger" isOpen={this.props.show} toggle={this.props.dismissError}>
        {this.props.message}
      </Alert>
    )
  }
}
const mapStateToProps = ({ admin }, ownProps) => admin.errorState

const mapDispatchToProps = dispatch => ({
  // errorMessage: message => dispatch(displayError(message)),
  dismissError: () => dispatch(dismissError())
})

export default connect(mapStateToProps, mapDispatchToProps)(ErrorMessage)
