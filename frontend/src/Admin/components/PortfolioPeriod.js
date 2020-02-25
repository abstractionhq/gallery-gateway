import React, { Component } from 'react'
import PropTypes from 'prop-types'

import PortfolioPeriodCard from '../components/PortfolioPeriodCard'
import Loading from '../../shared/components/Loading'

class Portfolios extends Component {
    static propTypes = {
        portfolioPeriods: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired,
        error: PropTypes.object
    }

    static defaultProps = {
        portfolioPeriods: []
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
        const { loading, portfolioPeriods } = this.props

        return (
            <div>
                {loading ? (
                    <Loading />
                ) : (
                    portfolioPeriods.map(period => <PortfolioPeriodCard key={period.id} {...period} />)
                )}
            </div>
        )
    }
}

export default Portfolios