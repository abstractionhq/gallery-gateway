import React from 'react'
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

const Shows = ({ user, loading }) => (
  <div>
    {loading ? null : user.shows.length ? (
      user.shows.map(show => <ShowCard key={show.id} {...show} />)
    ) : (
      <NoShowsContainer>
        You are not currently assinged to an active show
      </NoShowsContainer>
    )}
  </div>
)

Shows.propTypes = {
  user: PropTypes.object,
  loading: PropTypes.bool.isRequired
}
export default Shows
