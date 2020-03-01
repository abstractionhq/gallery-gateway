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
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaLongArrowLeft from '@fortawesome/fontawesome-free-solid/faLongArrowAltLeft'
import FaLongArrowRight from '@fortawesome/fontawesome-free-solid/faLongArrowAltRight'
import FaExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle'

import JudgesTable from '../components/JudgesTable'

const CenteredSubHeading = styled.h2`
  text-align: center;
`

const ReassignButtonContainer = styled.div`
  margin: 2em 0;
`

class AssignJudgesTable extends Component {
  static propTypes = {
    showId: PropTypes.string,
    portfolioPeriodId: PropTypes.string,
    fetchData: PropTypes.func.isRequired,
    data: PropTypes.shape({
      unassignedJudges: PropTypes.array.isRequired,
      assignedJudges: PropTypes.array.isRequired
    }),
    assign: PropTypes.func.isRequired,
    unassign: PropTypes.func.isRequired,
    handleError: PropTypes.func.isRequired,
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
      this.props
        .assign(judges)
        .then(() => {
          this.props.afterAssign(judges)
          // Reset the checkboxes
          this.setState({
            selectedUnassignedJudges: {},
            selectedAssignedJudges: {}
          })
        })
        .catch(err => this.props.handleError(err.message))
    }
  }

  unassign = () => {
    const judges = Object.keys(this.state.selectedAssignedJudges)

    if (judges.length) {
      this.props
        .unassign(judges)
        .then(() => {
          this.props.afterUnassign(judges)
          // Reset the checkboxes
          this.setState({
            selectedUnassignedJudges: {},
            selectedAssignedJudges: {}
          })
        })
        .catch(err => this.props.handleError(err.message))
    }
  }

  handleAssignedJudgesChange = selectedAssignedJudges => {
    this.setState({ selectedAssignedJudges })
  }

  handleUnassignedJudgesChange = selectedUnassignedJudges => {
    this.setState({ selectedUnassignedJudges })
  }

  render () {
    const { data, showId } = this.props

    return (
      <Fragment>
        <Modal
          isOpen={this.state.isUnassignConfirmationOpen}
          toggle={this.onDismissUnassignConfirmation}
          style={{ top: '25%' }}
        >
          <ModalHeader toggle={this.onDismissUnassignConfirmation}>
            Warning{' '}
            <FontAwesomeIcon
              icon={FaExclamationTriangle}
              className='align-middle'
            />
          </ModalHeader>
          <ModalBody>
            <p>
              Removing a judge will permanently delete any votes they have made
              in this {showId ? "show" : "portfolio period"}.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color='secondary'
              onClick={() => this.onDismissUnassignConfirmation()}
            >
              Cancel
            </Button>
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
                    Assign{' '}
                    <FontAwesomeIcon
                      icon={FaLongArrowRight}
                      className='align-middle'
                    />
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
                    <FontAwesomeIcon
                      icon={FaLongArrowLeft}
                      className='align-middle'
                    />{' '}
                    Unassign
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
