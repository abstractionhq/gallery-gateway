import React from 'react'
import PropTypes from 'prop-types'

import ShowCard from '../components/ShowCard'

const Shows = ({shows, loading}) => (
  <div>
    {loading ? null : shows.map((show) => (
      <ShowCard key={show.id} {...show} />
    ))}
  </div>
)

Shows.defaultProps = {
  shows: []
};

Shows.propTypes = {
  shows: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
}

export default Shows
