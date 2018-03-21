import React, { Component } from 'react'

const ErrorHandler = (View) => {
  class ErrorBoundary extends Component {
    constructor (props) {
      super(props)
      this.state = { hasError: false }
    }

    componentDidCatch (error, info) {
      // Display fallback UI
      this.setState({ hasError: true })
      console.error(error, info)
    }

    render () {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return (<h1>Something went wrong.</h1>)
      }
      return <View {...this.props} />
    }
  }
  return ErrorBoundary
}

export default ErrorHandler
