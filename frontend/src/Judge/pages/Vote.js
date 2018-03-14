import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import FaChevronLeft from 'react-icons/lib/fa/chevron-left'
import FaChevronRight from 'react-icons/lib/fa/chevron-right'
import queryString from 'query-string'

import { nextInQueue, previousInQueue, fetchSubmissions, setViewing } from '../actions'
import Submission from '../components/Submission'

const Arrow = styled.span`
  color: black;
  position: fixed;
  opacity: 0.25;
  transition: opacity 0.25s ease-in; /* fade light to dark when hover over */
  z-index: 10; /* to always be above the submission container */

  &:hover {
    cursor: pointer;
    opacity: 1;
  }
`

const Previous = Arrow.extend`
  left: 25px;
  padding: 225px 25px 200px 0; /* Create a larger click target */
`

const Next = Arrow.extend`
  padding: 225px 0 200px 25px; /* Create a larger click target */
  right: 25px;
`

const SubmissionContainer = styled.section`
  height: 100%;
  text-align: center;
  width: 100%;
`

class Vote extends Component {
  static propTypes = {
    show: PropTypes.shape({
      id: PropTypes.string
    }).isRequired,
    handlePrevious: PropTypes.func.isRequired,
    handleNext: PropTypes.func.isRequired,
    fetchSubmissions: PropTypes.func.isRequired,
    submission: PropTypes.shape({
      id: PropTypes.string
    }),
    previous: PropTypes.shape({
      id: PropTypes.string
    }),
    next: PropTypes.shape({
      id: PropTypes.string
    }),
    history: PropTypes.shape({
      push: PropTypes.func,
      replace: PropTypes.func
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string
    }).isRequired
  }

  static defaultProps = {
    submission: null
  }

  handleKeyInput = e => {
    const {
      handleNext,
      handlePrevious,
      previous,
      next
    } = this.props

    if (e.key === 'ArrowRight') {
      if (next && next.id) {
        handleNext()
      }
    } else if (e.key === 'ArrowLeft') {
      if (previous && previous.id) {
        handlePrevious()
      }
    }
  }

  componentDidMount () {
    const { on } = queryString.parse(this.props.location.search)
    // Need to call these (and have them finish) in order,
    // so that when we set 'viewing', there exists shuffle order
    Promise
      .resolve()
      // Fetches submissions, creates shuffle order, sets 'viewing' to 0
      .then(() => this.props.fetchSubmissions())
      // If /vote, sets 'viewing' to 0 TODO: Set to first un-viewed
      // If /vote?on=<entry_id>, sets 'viewing' to entry_id's index in the shuffle order, or 0 if not found
      .then(() => this.props.setViewing(on))

    document.addEventListener('keydown', this.handleKeyInput)
  }

  componentWillReceiveProps (nextProps) {
    const { on } = queryString.parse(this.props.location.search)

    // We're mounting this component at '/vote'
    if (this.props.submission === null && !on) {
      // Change the URL to '/vote?on=<entry_id>'
      // Don't keep the history to '/vote'
      this.props.history.replace(`/show/${this.props.show.id}/vote?on=${nextProps.submission.id}`)
    }

    // If we're mounting this component at '/vote?on=<entry_id>':
    // 1. On the first render, 'this.props.submission === null'
    // 2. 'this.props.fetchSubmissions()' will cause a second render
    // because it changes 'this.props.submission' to be the first submission in the shuffle order
    // 3. 'this.props.setViewing()' will cause a third render if the
    // 'entry_id' in the query params is not the id of the first submission in the shuffle order
    //
    // Updating the URL for 1 is undesired because this will always start back at the beginning.
    // Updating the URL for 2 is unnecessary if 'entry_id' is the id of the first submission in
    // the shuffle order, because it will match the submission that is rendered.
    // Therefore we only need to update the URL for 3, that is when 'this.props.submission !== null'
    // and the current and next submissions differ.
    //
    // Coincidentally, 'handleNext' and 'handlePrevious' events can be handled with this same check.
    if (this.props.submission !== null && this.props.submission !== nextProps.submission) {
      this.props.history.push(`/show/${this.props.show.id}/vote?on=${nextProps.submission.id}`)
    }
  }

  componentDidUpdate (prevProps) {
    const { on } = queryString.parse(this.props.location.search)
    // This will be called if 'on' is not found – replace the URL with the submission we're now viewing
    if (this.props.submission !== null && this.props.submission === prevProps.submission && prevProps.submission.id !== on) {
      this.props.history.replace(`/show/${this.props.show.id}/vote?on=${this.props.submission.id}`)
    }
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyInput)
  }

  render () {
    const {
      handleNext,
      handlePrevious,
      submission,
      previous,
      next
    } = this.props

    return (
      <Container fluid>
        <Row>
          <Col xs='1'>
            {previous && previous.id ? (
              <Previous onClick={handlePrevious}>
                <FaChevronLeft size='4em' />
              </Previous>
            ) : null}
          </Col>
          <Col xs='10' style={{ minHeight: '500px' }}>
            <SubmissionContainer>
              {submission ? <Submission submission={submission} /> : null}
            </SubmissionContainer>
          </Col>
          <Col xs='1'>
            {next && next.id ? (
              <Next onClick={handleNext}>
                <FaChevronRight size='4em' />
              </Next>
            ) : null}
          </Col>
        </Row>
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const showId = ownProps.match.params.id
  const { order = [], viewing = null } = state.judge.queues[showId] || {}
  const submissions = state.judge.submissions

  const obj = {
    show: {
      id: showId
    },
    submission: viewing !== null ? submissions[order[viewing]] : null
  }

  // Show the previous button
  if (viewing !== null && viewing > 0) {
    obj.previous = {
      id: order[viewing - 1]
    }
  }

  // Show the next button
  if (viewing !== null && viewing < order.length) {
    obj.next = {
      id: order[viewing + 1]
    }
  }

  return obj
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const showId = ownProps.match.params.id

  return {
    handlePrevious: () => dispatch(previousInQueue(showId)),
    handleNext: () => dispatch(nextInQueue(showId)),
    fetchSubmissions: () => dispatch(fetchSubmissions(showId)),
    setViewing: (on) => dispatch(setViewing(showId, on))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Vote)
