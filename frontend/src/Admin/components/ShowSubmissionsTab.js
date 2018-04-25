import React, { Component, Fragment } from 'react'
import {
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap'
import ReactTable from 'react-table'
import ShowSubmissionDetails from './ShowSubmissionDetails'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import FaYouTube from 'react-icons/lib/fa/youtube'
import FaVimeo from 'react-icons/lib/fa/vimeo'
import FaStar from 'react-icons/lib/fa/star'
import FaStarOpen from 'react-icons/lib/fa/star-o'
import FaBook from 'react-icons/lib/fa/book'
import FaExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle'
import FaClose from 'react-icons/lib/fa/close'
import { getImageThumbnail, STATIC_PATH } from '../../utils'

// Alert Types
const SUCCESS = 'SUCCESS'
const ERROR = 'ERROR'

const PhotoThumbnail = styled.img`
  height: auto;
  max-height: 5em;
  max-width: 100%;
  min-width: 3em;
  width: auto;
`

class ShowSubmissionsTab extends Component {
  static propTypes = {
    updateInvite: PropTypes.func.isRequired,
    finalizeInvites: PropTypes.func.isRequired,
    updateExcludeFromJudging: PropTypes.func.isRequired,
    show: PropTypes.shape({
      finalized: PropTypes.bool.isRequired,
      entries: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          title: PropTypes.string.isRequired,
          entryType: PropTypes.oneOf(['PHOTO', 'VIDEO', 'OTHER']).isRequired,
          invited: PropTypes.bool,
          path: PropTypes.string,
          provider: PropTypes.oneOf(['youtube', 'vimeo']),
          videoId: PropTypes.string
        })
      )
    }).isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      alertVisible: false,
      alertType: '',
      isFinalizeConfirmationOpen: false,
      isSubmissionModalOpen: false,
      viewingSubmissionId: null
    }
  }

  onDismissFinalizeConfirmation = () => {
    this.setState({
      isFinalizeConfirmationOpen: false
    })
  }

  onDismissSubmissionModal = () => {
    this.setState({
      isSubmissionModalOpen: false
    })
  }

  onDismissAlert = () => {
    this.setState({
      alertVisible: false,
      alertType: ''
    })
  }

  onDisplayFinalizeConfirmation = () => {
    this.setState({
      isFinalizeConfirmationOpen: true
    })
  }

  onDisplaySubmissionModal = submission => {
    this.setState({
      isSubmissionModalOpen: true,
      viewingSubmissionId: submission.id
    })
  }

  onDisplayAlert = type => {
    this.setState({
      alertVisible: true,
      alertType: type
    })
  }

  updateInvitation = (id, value) => {
    const { updateInvite } = this.props

    updateInvite(id, value)
      .then(() => {
        this.onDisplayAlert(SUCCESS)
        setTimeout(() => {
          this.onDismissAlert()
        }, 3000)
      })
      .catch(() => {
        this.onDisplayAlert(ERROR)
        setTimeout(() => {
          this.onDismissAlert()
        }, 3000)
      })
  }

  render () {
    const { show, finalizeInvites } = this.props

    return (
      <Fragment>
        {/* TODO: Remove alerts on this page */}
        <Alert
          color='success'
          style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            width: '100%',
            zIndex: '5'
          }}
          isOpen={this.state.alertVisible && this.state.alertType === SUCCESS}
          toggle={() => this.onDismissAlert()}
          className='text-center'
        >
          Invitation Saved
        </Alert>
        <Alert
          color='danger'
          style={{
            position: 'fixed',
            bottom: '0',
            left: '0',
            width: '100%',
            zIndex: '5'
          }}
          isOpen={this.state.alertVisible && this.state.alertType === ERROR}
          toggle={() => this.onDismissAlert()}
          className='text-center'
        >
          There was an error updating the invitation
        </Alert>
        <Modal
          isOpen={this.state.isFinalizeConfirmationOpen}
          toggle={this.onDismissFinalizeConfirmation}
          style={{ top: '25%' }}
        >
          <ModalHeader toggle={this.onDismissFinalizeConfirmation}>
            Warning <FaExclamationTriangle />
          </ModalHeader>
          <ModalBody>
            This is a permanent action and will make invitations for this show
            visible to all students.
          </ModalBody>
          <ModalFooter>
            <Button
              color='secondary'
              onClick={() => this.onDismissFinalizeConfirmation()}
            >
              Cancel
            </Button>{' '}
            <Button
              color='danger'
              onClick={() => {
                finalizeInvites()
                this.onDismissFinalizeConfirmation()
              }}
            >
              Continue
            </Button>
          </ModalFooter>
        </Modal>
        <div style={{ textAlign: 'right', margin: '10px' }}>
          <Button
            color={'primary'}
            disabled={show.finalized}
            onClick={() => this.onDisplayFinalizeConfirmation()}
          >
            {show.finalized
              ? 'Invitations Are Public'
              : 'Make Invitations Public'}
          </Button>
        </div>
        <ReactTable
          defaultPageSize={20}
          data={show.entries}
          defaultSorted={[{ id: 'score', desc: true }]}
          columns={[
            {
              Header: 'Row',
              Cell: row => row.viewIndex + 1,
              maxWidth: 50,
              sortable: false
            },
            {
              Header: 'Thumbnail',
              Cell: ({ original: submission }) => {
                switch (submission.entryType) {
                  case 'PHOTO':
                    return (
                      <PhotoThumbnail
                        alt={submission.title}
                        src={`${STATIC_PATH}${getImageThumbnail(
                          submission.path
                        )}`}
                      />
                    )
                  case 'VIDEO':
                    if (submission.provider === 'youtube') {
                      return <FaYouTube size='2em' />
                    } else {
                      return <FaVimeo size='2em' />
                    }
                  case 'OTHER':
                    // TODO: Should ends with .jpg should render the image thumbnail?
                    return <FaBook size='2em' />
                  default:
                    console.error(
                      `Unexpected Type ${submission.entryType}`,
                      submission
                    )
                    return null
                }
              },
              sortable: false,
              style: { textAlign: 'center' },
              width: 150
            },
            {
              Header: 'Title',
              accessor: 'title',
              Cell: ({ original: submission }) => (
                <div
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.onDisplaySubmissionModal(submission)}
                >
                  {submission.title}
                </div>
              )
            },
            {
              id: 'artist',
              Header: 'Artist',
              accessor: submission => {
                // Allows for sorting by student submitter's name
                const student = submission.student || submission.group.creator
                return `${student.username}`
              },
              Cell: ({ original: submission }) =>
                !submission.group ? (
                  `${submission.student.lastName}, ${
                    submission.student.firstName
                  } (${submission.student.username})`
                ) : (
                  <Fragment>
                    <small>Group</small>
                    <p>
                      {submission.group.creator.lastName},{' '}
                      {submission.group.creator.firstName} ({
                        submission.group.creator.username
                      })
                    </p>
                    <p>Participants: {submission.group.participants}</p>
                  </Fragment>
                )
            },
            {
              id: 'dimensions',
              accessor: submission =>
                // Allows for sorting by area
                submission.entryType === 'PHOTO'
                  ? submission.horizDimInch * submission.vertDimInch
                  : 0,
              Header: 'Dimensions',
              Cell: ({ original: submission }) =>
                submission.entryType === 'PHOTO'
                  ? `${submission.horizDimInch} in. \u00D7 ${
                    submission.vertDimInch
                  } in.`
                  : 'n/a'
            },
            {
              Header: 'Score',
              accessor: 'score',
              Cell: ({ original: submission }) => submission.score.toFixed(3)
            },
            {
              Header: 'Allowed',
              maxWidth: 75,
              sortable: false,
              style: { textAlign: 'center'},
              Cell: ({ original: submission }) => submission.excludeFromJudging ? 
                <FaClose color='red' size='2em' /> 
              : null
            },
            {
              Header: 'Invited',
              accessor: 'invited',
              Cell: ({ original: submission }) =>
                submission.invited ? (
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.updateInvitation(submission.id, false)}
                  >
                    <FaStar size='1.5em' style={{ color: 'gold' }} />
                  </span>
                ) : (
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.updateInvitation(submission.id, true)}
                  >
                    <FaStarOpen size='1.5em' />
                  </span>
                ),
              style: { textAlign: 'center' },
              width: 80
            }
          ]}
        />
        <Modal
          isOpen={this.state.isSubmissionModalOpen}
          toggle={this.onDismissSubmissionModal}
          style={{ minWidth: '50%' }}
        >
          <ModalHeader toggle={this.onDismissSubmissionModal} />
          <ModalBody>
            <ShowSubmissionDetails
            submission={this.props.show.entries.find(s => s.id === this.state.viewingSubmissionId)}  
            updateExcludeFromJudging={this.props.updateExcludeFromJudging} />
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

export default ShowSubmissionsTab
