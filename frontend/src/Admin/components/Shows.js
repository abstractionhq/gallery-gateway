import React from 'react'
import PropTypes from 'prop-types'

import ShowCard from '../components/ShowCard'
import LoadingIcon from '../components/Loading'

const Shows = ({ shows, loading }) => (
  <div>
    {loading || !shows ? <LoadingIcon /> : shows.map(show => <ShowCard key={show.id} {...show} />)}
  </div>
)

Shows.propTypes = {
  shows: PropTypes.array,
  loading: PropTypes.bool.isRequired
}

export default Shows
