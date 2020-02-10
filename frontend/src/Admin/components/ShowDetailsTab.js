import React, { Fragment, Component } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Row,
  Col,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaEdit from '@fortawesome/fontawesome-free-solid/faEdit'
import FaPrint from '@fortawesome/fontawesome-free-solid/faPrint'
import FaTable from '@fortawesome/fontawesome-free-solid/faTable'
import FaArchive from '@fortawesome/fontawesome-free-solid/faFileArchive'
import FaTrash from '@fortawesome/fontawesome-free-solid/faTrashAlt'
import FaExclamationTriangle from '@fortawesome/fontawesome-free-solid/faExclamationTriangle'

class ShowDetailsTab extends Component {
  static propTypes = {
    show: PropTypes.shape({
      description: PropTypes.string,
      entryCap: PropTypes.number.isRequired
    }).isRequired,
    downloadZip: PropTypes.func.isRequired,
    downloadCsv: PropTypes.func.isRequired,
    deleteShow: PropTypes.func.isRequired,
    doneDeleteShow: PropTypes.func.isRequired
  }

  state = {
    deleteModalShown: false,
    deleteInProgress: false
  }

  onDeleteInProgress () {
    this.setState({
      deleteInProgress: true
    })
  }

  onDeleteFinished () {
    this.setState({
      deleteInProgress: false
    })
  }

  onShowDeleteModal () {
    this.setState({
      deleteModalShown: true
    })
  }

  onDismissDeleteModal () {
    this.setState({
      deleteModalShown: false
    })
  }

  render () {
    const {
      downloadCsv,
      downloadZip,
      deleteShow,
      doneDeleteShow,
      show
    } = this.props
    return (
      <Fragment>
        <Row>
          <Col>
            {show.description ? (
              <Fragment>
                <dt>Description</dt>
                <dd>{show.description}</dd>
              </Fragment>
            ) : null}
            <dt>Individual Submission Limit</dt>
            <dd>{show.entryCap}</dd>
          </Col>
          <Col>
            <Button
              color='dark'
              className='text-left'
              outline
              block
              tag={Link}
              to={`/show/${show.id}/edit`}
            >
              <FontAwesomeIcon icon={FaEdit} className='align-middle' /> Edit
              Show Details
            </Button>
            <Button
              color='dark'
              className='text-left'
              outline
              block
              tag={Link}
              to={`/show/${show.id}/print`}
              target='_blank'
            >
              <FontAwesomeIcon icon={FaPrint} className='align-middle' /> Print
              Gallery Guide
            </Button>
            <Button
              color='dark'
              className='text-left'
              outline
              block
              onClick={() => downloadCsv()}
            >
              <FontAwesomeIcon icon={FaTable} className='align-middle' />{' '}
              Download CSV Report
            </Button>
            <Button
              color='dark'
              className='text-left'
              outline
              block
              onClick={() => downloadZip()}
            >
              <FontAwesomeIcon icon={FaArchive} className='align-middle' />{' '}
              Download Photo Submissions ZIP
            </Button>
            <Button
              color='danger'
              className='text-left'
              outline
              block
              onClick={() => this.onShowDeleteModal()}
            >
              <FontAwesomeIcon icon={FaTrash} className='align-middle' /> Delete
            </Button>
          </Col>
        </Row>
        <Modal
          isOpen={this.state.deleteModalShown}
          toggle={() => this.onDismissDeleteModal()}
          style={{ top: '25%' }}
        >
          <ModalHeader toggle={() => this.onDismissDeleteModal()}>
            Warning{' '}
            <FontAwesomeIcon
              icon={FaExclamationTriangle}
              className='align-middle'
            />
          </ModalHeader>
          <ModalBody>
            <p>This is a permanent action.</p>
            <p>
              When this show is deleted all entries will also be deleted. This
              cannot be undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color='secondary'
              onClick={() => this.onDismissDeleteModal()}
            >
              Cancel
            </Button>{' '}
            <Button
              color='danger'
              disabled={this.state.deleteInProgress}
              onClick={() => {
                this.onDeleteInProgress()
                deleteShow().then(() => {
                  this.onDeleteFinished()
                  doneDeleteShow()
                })
              }}
            >
              Continue
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    )
  }
}

export default ShowDetailsTab
