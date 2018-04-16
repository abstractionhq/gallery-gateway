import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, ButtonGroup } from 'reactstrap'
import styled from 'styled-components'

// Vote Values
const NO = 0
const MAYBE = 1
const YES = 2

const VotingContainer = styled.div`
  left: 0;
  margin: 10px auto;
  position: absolute;
  width: 100%;

  @media (min-width: 768px) {
    left: 25%;
    width: 50%;
  }
`

class VotePanel extends Component {
  static propTypes = {
    makeVote: PropTypes.func.isRequired,
    vote: PropTypes.shape({
      value: PropTypes.number
    })
  }

  constructor (props) {
    super(props)

    this.state = {
      alertVisible: false,
      alertType: ''
    }
  }

  onDismiss = () => {
    this.setState({
      alertVisible: false,
      alertType: ''
    })
  }

  handleVote = value => {
    const { makeVote } = this.props

    makeVote(value)
      .then(() => {
        this.setState({
          alertVisible: true,
        })
        setTimeout(() => {
          this.onDismiss()
        }, 2000)
      })
  }

  handleKeyInput = e => {
    const { vote } = this.props

    // Listen for key presses. Only update the choice if there is none selected
    // or the key pressed doesn't match the currently selected choice
    if ((e.key === '1' || e.key === 'n') && (!vote || vote.value !== NO)) {
      // 1 or n key
      this.handleVote(NO)
    } else if (
      (e.key === '2' || e.key === 'm') &&
      (!vote || vote.value !== MAYBE)
    ) {
      // 2 or m key
      this.handleVote(MAYBE)
    } else if (
      (e.key === '3' || e.key === 'y') &&
      (!vote || vote.value !== YES)
    ) {
      // 3 or y key
      this.handleVote(YES)
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeyInput)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyInput)
  }

  render () {
    const { vote } = this.props

    return (
      <VotingContainer>
        <ButtonGroup style={{ width: '100%' }}>
          <Button
            color={vote && vote.value === NO ? 'dark' : 'light'}
            size='lg'
            disabled={vote && vote.value === NO}
            onClick={() => this.handleVote(NO)}
            style={{ width: '33.33%', margin: '10px' }}
          >
            No
          </Button>
          <Button
            color={vote && vote.value === MAYBE ? 'dark' : 'light'}
            size='lg'
            disabled={vote && vote.value === MAYBE}
            onClick={() => this.handleVote(MAYBE)}
            style={{ width: '33.33%', margin: '10px' }}
          >
            Maybe
          </Button>
          <Button
            color={vote && vote.value === YES ? 'dark' : 'light'}
            size='lg'
            disabled={vote && vote.value === YES}
            onClick={() => this.handleVote(YES)}
            style={{ width: '33.33%', margin: '10px' }}
          >
            Yes
          </Button>
        </ButtonGroup>
        <Alert
          color='success'
          isOpen={this.state.alertVisible}
          className='text-center'
          style={{ position: 'fixed', bottom: '0', right: '0', margin: '10px' }}
        >
          Vote Saved
        </Alert>
      </VotingContainer>
    )
  }
}

export default VotePanel
