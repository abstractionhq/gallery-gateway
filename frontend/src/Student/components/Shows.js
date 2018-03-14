import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

import ShowCard from '../components/ShowCard'

const NoShowsContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: large;
`
const noShowsView = (
  <NoShowsContainer>
    No shows are currently running, come back later
  </NoShowsContainer>
)

const Shows = ({ shows, loading }) => {
  if (loading) return null
  if (shows.length === 0) return noShowsView
  return (
    <div>
      {shows.map(show => <ShowCard key={show.id} show={show} />)}
    </div>
  )
}

Shows.propTypes = {
  shows: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
}

Shows.defaultProps = {
  shows: []
}

export default Shows
