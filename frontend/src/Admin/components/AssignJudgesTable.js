import React, { Component, Fragment } from 'react'
import {
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import FaLongArrowLeft from 'react-icons/lib/fa/long-arrow-left'
import FaLongArrowRight from 'react-icons/lib/fa/long-arrow-right'
import FaExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle'

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
    selectedAssignedJudges: {},
    isUnassignConfirmationOpen: false
  }

  componentDidMount () {
    this.props.fetchData()
  }

  onDismissUnassignConfirmation = () => {
    this.setState({
      isUnassignConfirmationOpen: false
    })
  }

  onDisplayUnassignConfirmation = () => {
    this.setState({
      isUnassignConfirmationOpen: true
    })
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
      <Fragment>
        <Modal
          isOpen={this.state.isUnassignConfirmationOpen}
          toggle={this.onDismissUnassignConfirmation}
          style={{ top: '25%' }}
        >
          <ModalHeader toggle={this.onDismissUnassignConfirmation}>
            Warning <FaExclamationTriangle />
          </ModalHeader>
          <ModalBody>
            <p>
              Removing a judge will permanently delete any votes they have made
              in this show.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color='secondary'
              onClick={() => this.onDismissUnassignConfirmation()}
            >
              Cancel
            </Button>{' '}
            <Button
              color='danger'
              onClick={() => {
                this.onDismissUnassignConfirmation()
                this.unassign()
              }}
            >
              Continue
            </Button>
          </ModalFooter>
        </Modal>
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
                    disabled={
                      !Object.keys(this.state.selectedUnassignedJudges).length
                    }
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
                    onClick={() => this.onDisplayUnassignConfirmation()}
                    disabled={
                      !Object.keys(this.state.selectedAssignedJudges).length
                    }
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
      </Fragment>
    )
  }
}

export default AssignJudgesTable
