import React from 'react'
import PropTypes from 'prop-types'

import ShowCard from '../components/ShowCard'

const Shows = ({ user, loading }) => (
  <div>
    {loading ? null :
    user.shows.length > 0 ? user.shows.map(show => <ShowCard key={show.id} {...show} />) :
    "You are not currently assinged to a show"
    }
  </div>
)

Shows.propTypes = {
  user: PropTypes.object,
  loading: PropTypes.bool.isRequired
}
export default Shows
