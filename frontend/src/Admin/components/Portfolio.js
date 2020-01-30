import React, { Component } from 'react'
import PropTypes from 'prop-types'

import PortfolioCard from '../components/PortfolioCard'
import Loading from '../../shared/components/Loading'

class Portfolios extends Component {
    static propTypes = {
        shows: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
        error: PropTypes.object
    }

    static defaultProps = {
        shows: []
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
        const { loading, shows } = this.props

        return (
            <div>
                {loading ? (
                    <Loading />
                ) : (
                    shows.map(show => <PortfolioCard key={show.id} {...show} />)
                )}
            </div>
        )
    }
}

export default Portfolios