import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaChevronLeft from '@fortawesome/fontawesome-free-solid/faChevronLeft'
import FaChevronRight from '@fortawesome/fontawesome-free-solid/faChevronRight'
import queryString from 'query-string'
import { setViewing, fetchSubmissions, fetchVotes } from '../actions'
import Submission from '../components/Submission'
import VotePanel from '../containers/VotePanel'

const Arrow = styled.span`
  color: white;
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

class Vote extends Component {
  static propTypes = {
    show: PropTypes.shape({
      id: PropTypes.string
    }).isRequired,
    setViewing: PropTypes.func.isRequired,
    fetchSubmissions: PropTypes.func.isRequired,
    submission: PropTypes.object,
    previous: PropTypes.shape({
      id: PropTypes.string
    }),
    next: PropTypes.shape({
      id: PropTypes.string
    }),
    fetchVotes: PropTypes.func.isRequired,
    vote: PropTypes.object
  }

  static defaultProps = {
    submission: null
  }

  handleKeyInput = e => {
    const { setViewing, previous, next } = this.props
    if (e.key === 'ArrowRight') {
      if (next && next.id) {
        setViewing(next.id)
      }
    } else if (e.key === 'ArrowLeft') {
      if (previous && previous.id) {
        setViewing(previous.id)
      }
    }
  }

  componentDidMount () {
    this.props.fetchSubmissions()
    this.props.fetchVotes()
    document.addEventListener('keydown', this.handleKeyInput)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyInput)
  }

  render () {
    const { setViewing, submission, previous, next, vote } = this.props

    return (
      <Container fluid>
        <Row style={{ backgroundColor: '#777777', maxHeight: '75vh', minHeight: '70vh', paddingTop: '25px' }}>
          <Col xs='1'>
            {previous && previous.id ? (
              <Previous onClick={() => setViewing(previous.id)}>
                <FontAwesomeIcon icon={FaChevronLeft} size='4x' />
              </Previous>
            ) : null}
          </Col>
          <Col xs='10'>
            {submission ? <Submission submission={submission} /> : null}
          </Col>
          <Col xs='1'>
            {next && next.id ? (
              <Next onClick={() => setViewing(next.id)}>
                <FontAwesomeIcon icon={FaChevronRight} size='4x' />
              </Next>
            ) : null}
          </Col>
        </Row>
        {submission ? (
          <Row>
            <Col>
              <section>
                <VotePanel submission={submission} vote={vote} />
              </section>
            </Col>
          </Row>
        ) : null}
      </Container>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const showId = ownProps.match.params.id
  const { order = [], loadingVotes = true, loadingSubmissions = true } =
    state.judge.queues[showId] || {}
  let { on: submissionId } = queryString.parse(state.router.location.search)

  // If this submissionId is not in the ordering, throw it out
  if (order.indexOf(submissionId) < 0) {
    submissionId = null
  }

  // No satisfactory submission ID was found. If the data is loaded, loop
  // through the order and find the first un-voted submission; we'll use that one.
  // In the event that _all_ submissions have votes, use the first submission.
  if (submissionId === null && !loadingSubmissions && !loadingVotes) {
    for (let i = 0; i < order.length; i++) {
      const candidateSubmissionId = order[i]
      const isVoted = !!state.judge.votes.byEntryId[candidateSubmissionId]
      if (!isVoted) {
        submissionId = candidateSubmissionId
        break
      }
    }

    // If everything is voted on, just set the current submission to the first one
    if (submissionId === null) {
      submissionId = order[0] || null
    }

    if (submissionId !== null) {
      const newQueryString = queryString.stringify({
        ...queryString.parse(ownProps.location.search),
        on: submissionId
      })
      ownProps.history.replace(`/show/${showId}/vote?${newQueryString}`)
    }
  }

  const viewing = submissionId !== null ? order.indexOf(submissionId) : null
  const submissions = state.judge.submissions
  const votes = state.judge.votes

  const obj = {
    show: {
      id: showId
    },
    submission: submissionId !== null ? submissions[submissionId] : null,
    vote: submissionId !== null ? votes.byEntryId[submissionId] : null
  }

  // Show the previous button
  if (viewing !== null && viewing > 0) {
    obj.previous = {
      id: order[viewing - 1]
    }
  }

  // Show the next button
  if (viewing !== null && viewing + 1 < order.length) {
    obj.next = {
      id: order[viewing + 1]
    }
  }

  return obj
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const showId = ownProps.match.params.id

  return {
    setViewing: submissionId => dispatch(setViewing(showId, submissionId)),
    fetchSubmissions: () => dispatch(fetchSubmissions(showId)),
    fetchVotes: () => dispatch(fetchVotes(showId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Vote)
