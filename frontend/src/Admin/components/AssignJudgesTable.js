import React, { Component } from 'react'
import { Row, Col, Button } from 'reactstrap'
import { Flex, Box } from 'rebass'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left'
import FaLongArrowRight from 'react-icons/lib/fa/long-arrow-right'

import JudgesTable from '../components/JudgesTable'

const CenteredSubHeading = styled.h2`
  text-align: center;
`

class JudgeAssignmentTables extends Component {
  static propTypes = {
    showId: PropTypes.string.isRequired,
    fetchData: PropTypes.func.isRequired,
    data: PropTypes.shape({
      unassignedJudges: PropTypes.array.isRequired,
      assignedJudges: PropTypes.array.isRequired
    }),
    assign: PropTypes.func.isRequired,
    unassign: PropTypes.func.isRequired
  }

  static defaultProps = {
    data: {
      assignedJudges: [],
      unassignedJudges: []
    }
  }

  state = {
    selectedUnassignedJudges: {},
    selectedAssignedJudges: {}
  }

  componentDidMount () {
    this.props.fetchData()
  }

  assign = () => {
    const judges = Object.keys(this.state.selectedUnassignedJudges)

    if (judges.length) {
      this.props.assign(judges)
      // TODO: Refetch / Update Local Data
    }
  }

  unassign = () => {
    const judges = Object.keys(this.state.selectedAssignedJudges)

    if (judges.length) {
      this.props.unassign(judges)
      // TODO: Refetch / Update Local Data
    }
  }

  handleAssignedJudgesChange = (selectedAssignedJudges) => {
    this.setState({selectedAssignedJudges})
  }

  handleUnassignedJudgesChange = (selectedUnassignedJudges) => {
    this.setState({selectedUnassignedJudges})
  }

  render () {
    const {
      data
    } = this.props

    return (
      <Row>
        <Col xs='12' md='5'>
          <CenteredSubHeading>Unassigned</CenteredSubHeading>
          <JudgesTable
            judges={data.unassignedJudges}
            selected={this.state.selectedUnassignedJudges}
            onChange={this.handleUnassignedJudgesChange}
          />
          {/* TODO: Form and Button to Create a new Judge */}
        </Col>
        <Col xs='12' md='2'>
          <Flex column align='center' justify='center' style={{minHeight: '50vh'}}>
            <Box mb={50} w='100%'>
              <Button
                color='primary'
                block
                style={{cursor: 'pointer'}}
                onClick={() => this.assign()}
              >
                Assign <FaLongArrowRight />
              </Button>
            </Box>
            <Box mt={50} w='100%'>
              <Button
                color='primary'
                block
                style={{cursor: 'pointer'}}
                onClick={() => this.unassign()}
              >
                <FaLongArrowLeft /> Unassign
              </Button>
            </Box>
          </Flex>
        </Col>
        <Col xs='12' md='5'>
          <CenteredSubHeading>Assigned</CenteredSubHeading>
          <JudgesTable
            judges={data.assignedJudges}
            selected={this.state.selectedAssignedJudges}
            onChange={this.handleAssignedJudgesChange}
          />
        </Col>
      </Row>
    )
  }
}

export default JudgeAssignmentTables
