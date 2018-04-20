import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

import ShowCard from '../components/ShowCard'

const NoShowsContainer = styled.div`
  font-size: large;
  left: 50%;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
`
class Shows extends Component {
  renderShows = shows  => {
    if (shows.length === 0) {
      return (
        <NoShowsContainer>
          No show calls are currently in progress. Check back soon!
        </NoShowsContainer>
      )
    }
    return shows.map(show => <ShowCard key={show.id} show={show} />)
  }

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
        {loading ? null : this.renderShows(shows)}
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
