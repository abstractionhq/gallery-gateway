import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

import PortfolioCard from '../components/PortfolioCard'
import Loading from '../../shared/components/Loading'

const NoShowsContainer = styled.div`
  font-size: large;
  left: 50%;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
`
class Portfolios extends Component {
  renderPortfolios = portfolios => {
    if (!portfolios || portfolios.length === 0) {
      return (
        <NoShowsContainer>
          The scholarship period is not currently open. Check back soon!
        </NoShowsContainer>
      )
    }
    return portfolios.map(portfolios => <PortfolioCard key={portfolios.id} portfolio={portfolios} />)
  }

  componentDidUpdate () {
    const { error, handleError } = this.props
    if (error) {
      error.graphQLErrors.forEach(e => {
        handleError(e.message)
      })
    }
  }

  render () {
    const { loading, portfolios } = this.props

    return <div>{loading ? <Loading /> : this.renderPortfolios(portfolios)}</div>
  }
}

Portfolios.propTypes = {
  shows: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object
}

Portfolios.defaultProps = {
  shows: []
}

export default Portfolios
