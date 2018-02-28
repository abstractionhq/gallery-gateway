import React from 'react'
import PropTypes from 'prop-types'

import ShowCard from '../components/ShowCard'

const Shows = ({ shows, loading }) => (
  <div>
    {loading ? null : shows.map(show => <ShowCard key={show.id} show={show} />)}
  </div>
)

Shows.propTypes = {
  shows: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
}

Shows.defaultProps = {
  shows: []
}

export default Shows
