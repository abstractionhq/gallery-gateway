import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import ShowCard from '../components/ShowCard'

const NoShowsContainer = styled.div`
  font-size: large;
  left: 50%;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
`

const Shows = ({ shows, loading }) => {
  if (loading) return null
  if (shows.length === 0) {
    return (
      <NoShowsContainer>
        No show calls are currently in progress. Check back soon!
      </NoShowsContainer>
    )
  }
  return <div>{shows.map(show => <ShowCard key={show.id} show={show} />)}</div>
}

Shows.propTypes = {
  shows: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
}

Shows.defaultProps = {
  shows: []
}

export default Shows
