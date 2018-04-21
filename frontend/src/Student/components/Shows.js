import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

import ShowCard from '../components/ShowCard'
import Loading from '../../shared/components/Loading'

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
        {loading ? <Loading /> : this.renderShows(shows)}
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
