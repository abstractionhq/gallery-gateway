import React, { Component } from 'react'
import PropTypes from 'prop-types'

import ShowCard from '../components/ShowCard'
import Loading from '../../shared/components/Loading'

class Shows extends Component {
  render () {
    const { loading, shows, error, handleError } = this.props

    // TODO: Move this somewhere else. This makes the 'render' function impure and React throws a warning.
    if (error) {
      error.graphQLErrors.forEach((e) => {
        handleError(e.message)
      })
    }

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
