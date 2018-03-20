import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'reactstrap'
import styled from 'styled-components'
import FaChevronLeft from 'react-icons/lib/fa/chevron-left'
import FaChevronRight from 'react-icons/lib/fa/chevron-right'

import { nextInQueue, previousInQueue, fetchSubmissions, fetchVotes } from '../actions'
import Submission from '../components/Submission'
import VotePanel from '../containers/VotePanel'

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
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 25%;
  text-align:center;
`

const VoteContainer = styled.section`
  position: absolute;
  top: 80%;
  right: 0;
  left: 0;
  bottom: 20px;
  text-align:center;
`

class Vote extends Component {
  handleKeyInput = e => {
    const {
      show,
      handleNext,
      handlePrevious,
      submission,
      previous,
      next
    } = this.props
    if (e.key === 'ArrowRight') {
      if (next && next.id) {
        handleNext()
        this.props.history.push(`/show/${show.id}/vote?on=${next.id}`)
      }
    } else if (e.key === 'ArrowLeft') {
      if (previous && previous.id) {
        handlePrevious()
        this.props.history.push(`/show/${show.id}/vote?on=${previous.id}`)
      }
    }
  }

  static propTypes = {
    show: PropTypes.shape({
      id: PropTypes.string
    }).isRequired,
    handlePrevious: PropTypes.func.isRequired,
    handleNext: PropTypes.func.isRequired,
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

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyInput)
  }

  componentDidMount () {
    this.props.fetchSubmissions()
    this.props.fetchVotes()
    document.addEventListener('keydown', this.handleKeyInput)
    // TODO:
    // a) If we're visiting this page for the first time (/vote)
    //   1. fetch all entries for the show we're voting on
    //   2. create the shuffle order
    //   3. identify the first unvoted entry; set the 'viewing' state properly
    //   4. go to the route /show/<show_id>/vote?on=<entry_id> so that the page will re-render populated w/ the entry
    // b) If we're visiting a specific entry for the first time (/vote?on=<entry_id>) (i.e. refresh)
    //   1. fetch all entries for the show we're voting on
    //   2. create the shuffle order
    //   3. update the 'viewing' state based on the entry in the query param
    //   4. render the entry in the query param
    // c) If we're returning to this page (/vote) (i.e. entries and shuffle order exist)
    //   1. identify the first unvoted entry; set the 'viewing' state properly
    //   2. go to the route /show/<show_id>/vote?on=<entry_id> so that the page will re-render populated w/ the entry
    // d) If we're returning to a specific entry on this page (/vote?on=<entry_id>) (i.e. from a) 4. or from review page)
    //   1. update the 'viewing' state based on the entry in the query param (if they don't already match)
    //   2. render the entry in the query param
  }

  render () {
    const {
      show,
      handleNext,
      handlePrevious,
      submission,
      previous,
      next,
      vote
    } = this.props

    return (
      <Container fluid>
        <Row>
          <Col xs='1'>
            {previous && previous.id ? (
              <Link to={`/show/${show.id}/vote?on=${previous.id}`}>
                <Previous onClick={handlePrevious}>
                  <FaChevronLeft size='4em' />
                </Previous>
              </Link>
            ) : null}
          </Col>
          <Col xs='10' style={{ minHeight: '500px', height: '100%' }}>
            <SubmissionContainer>
              {submission ? <Submission submission={submission} /> : null}
            </SubmissionContainer>
            <VoteContainer>
              {submission ? <VotePanel submission={submission} vote={vote} /> : null}
            </VoteContainer>
          </Col>
          <Col xs='1'>
            {next && next.id ? (
              <Link to={`/show/${show.id}/vote?on=${next.id}`}>
                <Next onClick={handleNext}>
                  <FaChevronRight size='4em' />
                </Next>
              </Link>
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
  const votes = state.judge.votes

  const obj = {
    show: {
      id: showId
    },
    submission: viewing !== null ? submissions[order[viewing]] : null,
    vote: viewing !== null ? votes.byEntryId[order[viewing]] : null
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
    fetchVotes: () => dispatch(fetchVotes(showId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Vote)
