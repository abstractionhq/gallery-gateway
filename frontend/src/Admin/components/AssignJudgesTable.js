import React, { Component } from 'react'
import { Row, Col, Button } from 'reactstrap'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left'
import FaLongArrowRight from 'react-icons/lib/fa/long-arrow-right'

import JudgesTable from '../components/JudgesTable'

const CenteredSubHeading = styled.h2`
  text-align: center;
`

const ReassignButtonContainer = styled.div`
  margin: 2em 0;
`

class AssignJudgesTable extends Component {
  static propTypes = {
    showId: PropTypes.string.isRequired,
    fetchData: PropTypes.func.isRequired,
    data: PropTypes.shape({
      unassignedJudges: PropTypes.array.isRequired,
      assignedJudges: PropTypes.array.isRequired
    }),
    assign: PropTypes.func.isRequired,
    unassign: PropTypes.func.isRequired,
    afterAssign: PropTypes.func.isRequired,
    afterUnassign: PropTypes.func.isRequired
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
      this.props.assign(judges).then(() => {
        this.props.afterAssign(judges)
        // Reset the checkboxes
        this.setState({
          selectedUnassignedJudges: {},
          selectedAssignedJudges: {}
        })
      })
    }
  }

  unassign = () => {
    const judges = Object.keys(this.state.selectedAssignedJudges)

    if (judges.length) {
      this.props.unassign(judges).then(() => {
        this.props.afterUnassign(judges)
        // Reset the checkboxes
        this.setState({
          selectedUnassignedJudges: {},
          selectedAssignedJudges: {}
        })
      })
    }
  }

  handleAssignedJudgesChange = selectedAssignedJudges => {
    this.setState({ selectedAssignedJudges })
  }

  handleUnassignedJudgesChange = selectedUnassignedJudges => {
    this.setState({ selectedUnassignedJudges })
  }

  render () {
    const { data } = this.props

    return (
      <Row>
        <Col xs='12' md='5'>
          <CenteredSubHeading>Unassigned</CenteredSubHeading>
          <JudgesTable
            judges={data.unassignedJudges}
            selected={this.state.selectedUnassignedJudges}
            onChange={this.handleUnassignedJudgesChange}
          />
        </Col>
        <Col xs='12' md='2' className='align-self-center'>
          <Row>
            <Col xs={12}>
              <ReassignButtonContainer>
                <Button
                  color='primary'
                  block
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.assign()}
                >
                  Assign <FaLongArrowRight />
                </Button>
              </ReassignButtonContainer>
            </Col>
            <Col xs={12}>
              <ReassignButtonContainer>
                <Button
                  color='primary'
                  block
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.unassign()}
                >
                  <FaLongArrowLeft /> Unassign
                </Button>
              </ReassignButtonContainer>
            </Col>
          </Row>
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

export default AssignJudgesTable
