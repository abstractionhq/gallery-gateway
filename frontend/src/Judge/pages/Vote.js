import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import FaChevronLeft from 'react-icons/lib/fa/chevron-left'
import FaChevronRight from 'react-icons/lib/fa/chevron-right'
import queryString from 'query-string'
import { compose } from 'recompose'

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
  padding: 35vh 25px 15vh 0; /* Create a larger click target */
`

const Next = Arrow.extend`
  padding: 35vh 0 15vh 25px; /* Create a larger click target */
  right: 25px;
`

const Progress = styled.div`
  color: white;
  position: absolute;
  right: 0;
  top: 0;
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
    vote: PropTypes.object,
    totalSubmissions: PropTypes.number.isRequired,
    currentIndex: PropTypes.number.isRequired
  }

  static defaultProps = {
    submission: null,
    totalSubmissions: 0,
    currentIndex: 0
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
    const {
      setViewing,
      submission,
      previous,
      next,
      vote,
      totalSubmissions,
      currentIndex
    } = this.props

    return (
      <Container fluid>
        <Row
          style={{
            backgroundColor: '#777777',
            minHeight: 'calc(100vh - 56px)',
            paddingTop: '25px'
          }}
        >
          <Col xs='12' style={{ maxHeight: '60vh' }}>
            <Row>
              <Col xs='1'>
                {previous && previous.id ? (
                  <Previous onClick={() => setViewing(previous.id)}>
                    <FaChevronLeft size='4em' />
                  </Previous>
                ) : null}
              </Col>
              <Col xs='10'>
                <Progress>
                  {currentIndex} / {totalSubmissions}
                </Progress>
                {submission ? <Submission submission={submission} /> : null}
              </Col>
              <Col xs='1'>
                {next && next.id ? (
                  <Next onClick={() => setViewing(next.id)}>
                    <FaChevronRight size='4em' />
                  </Next>
                ) : null}
              </Col>
            </Row>
          </Col>
          {submission ? (
            <Col xs='12'>
              <VotePanel submission={submission} vote={vote} />
            </Col>
          ) : null}
        </Row>
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
    vote: submissionId !== null ? votes.byEntryId[submissionId] : null,
    currentIndex: viewing + 1,
    totalSubmissions: order.length
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

export default compose(connect(mapStateToProps, mapDispatchToProps))(Vote)
