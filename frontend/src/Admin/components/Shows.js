import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ShowCard from '../components/ShowCard'
import Loading from '../../shared/components/Loading'

class Shows extends Component {

  componentDidUpdate() {
    const { error, handleError } = this.props
    if (error) {
      error.graphQLErrors.forEach((e) => {
        handleError(e.message)
      })
    }
  }

  render () {
    const { loading, shows } = this.props

    return (
      <div>
        {loading ? <Loading /> : shows.map(show => <ShowCard key={show.id} {...show} />)}
      </div>
    )
  }
}

Shows.propTypes = {
  shows: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object
}

Shows.defaultProps = {
  shows: []
}

export default Shows
