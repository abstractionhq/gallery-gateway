import React from 'react'
import PropTypes from 'prop-types'

import ShowCard from '../components/ShowCard'
import Loading from '../../shared/components/Loading'

const Shows = ({ shows, loading }) => (
  <div>
    {loading ? <Loading /> : shows.map(show => <ShowCard key={show.id} {...show} />)}
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
