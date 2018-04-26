import React, { Fragment, Component } from 'react'
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

import FaPrint from 'react-icons/lib/fa/print'
import FaTable from 'react-icons/lib/fa/table'
import FaArchive from 'react-icons/lib/fa/file-archive-o'
import FaTrash from 'react-icons/lib/fa/trash-o'
import FaExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle'

class ShowDetailsTab extends Component {
  static propTypes = {
    show: PropTypes.shape({
      description: PropTypes.string,
      entryCap: PropTypes.string.isRequired
    }).isRequired,
    downloadZip: PropTypes.func.isRequired,
    downloadCsv: PropTypes.func.isRequired,
    deleteShow: PropTypes.func.isRequired,
    doneDeleteShow: PropTypes.func.isRequired
  }

  state = {
    deleteModalShown: false
  }

  constructor (props) {
    super(props)

    this.state = {
      deleteModalShown: false
    }
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
            <Button color='dark' className='text-left' outline block>
              <FaPrint /> Print Gallery Guide
            </Button>
            <Button
              color='dark'
              className='text-left'
              outline
              block
              onClick={() => downloadCsv()}
            >
              <FaTable /> Download CSV Report
            </Button>
            <Button
              color='dark'
              className='text-left'
              outline
              block
              onClick={() => downloadZip()}
            >
              <FaArchive /> Download Photo Submissions ZIP
            </Button>
            <Button
              color='danger'
              className='text-left'
              outline
              block
              onClick={() => this.onShowDeleteModal()}
            >
              <FaTrash /> Delete
            </Button>
          </Col>
        </Row>
        <Modal
          isOpen={this.state.deleteModalShown}
          toggle={() => this.onDismissDeleteModal()}
          style={{ top: '25%' }}
        >
          <ModalHeader toggle={() => this.onDismissDeleteModal()}>
            Warning <FaExclamationTriangle />
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
              onClick={() => deleteShow().then(() => doneDeleteShow())}
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
