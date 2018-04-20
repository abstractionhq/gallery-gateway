import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import ShowCard from '../components/ShowCard'

const NoShowsContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: large;
`
class Shows extends Component {
  renderShows = user  => {
    if (user && user.shows.length){
      return user.shows.map(show => <ShowCard key={show.id} {...show} />)
    } 
    return (
      <NoShowsContainer>
        You are not currently assigned to any future shows
      </NoShowsContainer>
    )
  }

  render () {
    const { loading, user, error, handleError } = this.props

    // TODO: Move this somewhere else. This makes the 'render' function impure and React throws a warning.
    if (error) {
      error.graphQLErrors.forEach((e) => {
        handleError(e.message)
      })
    }

    return (
      <div>
        {loading ? null : this.renderShows(user)}
      </div>
    )
  }
} 

Shows.propTypes = {
  user: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object
}
export default Shows
