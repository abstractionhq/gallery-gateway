import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, ButtonGroup } from 'reactstrap'
import styled from 'styled-components'

const VoteSpacing = styled.span`
  margin: 10px;
`

class VotePanel extends Component {
  static propTypes = {
    vote: PropTypes.func.isRequired,
    data: PropTypes.shape({
      vote: PropTypes.shape({
        value: PropTypes.number
      })
    })
  }

  constructor (props) {
    super(props)
    this.state = {
      alertVisible: false
    }
  }

  onDismiss () {
    this.setState({ alertVisible: false })
  }

  handleVote () {
    // TODO: Notify on errors
    this.setState({ alertVisible: true })
    setTimeout(() => {
      this.setState({ alertVisible: false })
    }, 3000)
  }

  render () {
    const { vote, data } = this.props
    const entryVote = data.vote
    return (
      <div>
        <ButtonGroup>
          <VoteSpacing>
            <Button
              color='primary'
              size='lg'
              active={entryVote && entryVote.value === 0}
              onClick={() => vote(0).then(this.handleVote())}
            >
              No
            </Button>
          </VoteSpacing>
          <VoteSpacing>
            <Button
              color='primary'
              size='lg'
              active={entryVote && entryVote.value === 1}
              onClick={() => vote(1).then(this.handleVote())}
            >
              Maybe
            </Button>
          </VoteSpacing>
          <VoteSpacing>
            <Button
              color='primary'
              size='lg'
              active={entryVote && entryVote.value === 2}
              onClick={() => vote(2).then(this.handleVote())}
            >
              Yes
            </Button>
          </VoteSpacing>
        </ButtonGroup>
        <Alert
          color='success'
          isOpen={this.state.alertVisible}
          toggle={() => this.onDismiss()}
        >
          Vote Saved
        </Alert>
      </div>
    )
  }
}

export default VotePanel
