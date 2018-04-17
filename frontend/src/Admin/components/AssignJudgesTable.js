import React, { Component } from 'react'
import { Row, Col, Button } from 'reactstrap'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaLongArrowLeft from '@fortawesome/fontawesome-free-solid/faLongArrowAltLeft'
import FaLongArrowRight from '@fortawesome/fontawesome-free-solid/faLongArrowAltRight'

import JudgesTable from '../components/JudgesTable'

const CenteredSubHeading = styled.h2`
  text-align: center;
`

const ReassignButtonContainer = styled.div`
  margin-bottom: 5em;
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
    handleError: PropTypes.func.isRequired,
    afterAssign: PropTypes.func.isRequired,
    afterUnassign: PropTypes.func.isRequired,
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
      }).catch(err => this.props.handleError(err.message))
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
      }).catch(err => this.props.handleError(err.message))
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
                  Assign <FontAwesomeIcon icon={FaLongArrowRight} className='align-middle' />
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
                  <FontAwesomeIcon icon={FaLongArrowLeft} className='align-middle' /> Unassign
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
