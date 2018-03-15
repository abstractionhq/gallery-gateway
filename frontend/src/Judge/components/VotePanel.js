import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Alert, Button, ButtonGroup } from 'reactstrap'
import styled from 'styled-components'

const VoteSpacing = styled.span`
  margin: 10px;
`

class VotePanel extends Component {
  static propTypes = {
    // user: PropTypes.shape({
    //   username: PropTypes.string
    // }).isRequired,
    vote: PropTypes.func.isRequired,
   // entryId: PropTypes.string.isRequired
  }
  constructor(props) {
    super(props)
    this.state = {
      alertVisible: false
    }
  }

  onDismiss() {
    this.setState({ alertVisible: false })
  }

  sendVote (score) {
    this.setState({ alertVisible: true })

    console.log(score)
  }

  render() {
    const { vote, user, entryId } = this.props
    const input = {
      judgeUsername: 'user1',
      entryId: entryId,
      score: 0
    }
    return (
      <div>
        <ButtonGroup >
          <VoteSpacing><Button color="primary" size="lg" onClick={() => vote(input)} >No</Button></VoteSpacing>
          <VoteSpacing><Button color="primary" size="lg" onClick={() => this.sendVote(1)} >Maybe</Button></VoteSpacing>
          <VoteSpacing><Button color="primary" size="lg" onClick={() => this.sendVote(2)} >Yes</Button></VoteSpacing>
        </ButtonGroup>
        <Alert color="success" isOpen={this.state.alertVisible} toggle={() => this.onDismiss()}>
          Vote Saved  
        </Alert>
      </div>
    )
  }
}

export default VotePanel