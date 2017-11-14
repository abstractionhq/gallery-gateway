import React, { Component } from 'react'
import { Row, Col, Button } from 'reactstrap'
import { Flex, Box } from 'rebass'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import JudgesTable from '../components/JudgesTable'

const CenteredSubHeading = styled.h2`
  text-align: center;
`

class JudgeAssignmentTables extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    unassigned: PropTypes.array.isRequired,
    assigned: PropTypes.array.isRequired,
    unassign: PropTypes.func.isRequired,
    assign: PropTypes.func.isRequired,
    show: PropTypes.string.isRequired
  }

  static defaultProps = {
    unassigned: [],
    assigned: []
  }

  assign = () => {
    const {
      show
    } = this.props

    // TODO: GraphQL Mutation to assign the checked values in the unassigned table
    this.props.assign(show, []) // TODO: Usernames
  }

  unassign = () => {
    const {
      show
    } = this.props

    // TODO: GraphQL Mutation to unassign the checked values in the assigned table
    this.props.unassign(show, []) // TODO: Usernames
  }

  render () {
    const {
      loading,
      unassigned,
      assigned
    } = this.props

    return (
      <Row>
        <Col>
          <CenteredSubHeading>Unassigned</CenteredSubHeading>
          <JudgesTable judges={loading ? [] : unassigned} />
          {/* TODO: Form and Button to Create a new Judge */}
        </Col>
        <Col sm='2'>
          <Flex column align='center' justify='center' style={{minHeight: '50vh'}}>
            <Box mb={50} w='100%'>
              <Button
                color='primary'
                block
                style={{cursor: 'pointer'}}
                onClick={() => this.assign()}
              >
                Assign <span className='oi oi-arrow-right' aria-hidden='true'></span>
              </Button>
            </Box>
            <Box mt={50} w='100%'>
              <Button
                color='primary'
                block
                style={{cursor: 'pointer'}}
                onClick={() => this.unassign()}
              >
                <span className='oi oi-arrow-left' aria-hidden='true'></span> Unassign
              </Button>
            </Box>
          </Flex>
        </Col>
        <Col>
          <CenteredSubHeading>Assigned</CenteredSubHeading>
          <JudgesTable judges={loading ? [] : assigned} />
        </Col>
      </Row>
    )
  }
}

export default JudgeAssignmentTables
