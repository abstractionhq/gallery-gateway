import React, { Component, Fragment } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import ReactTable from 'react-table'
import ShowSubmissionDetails from './ShowSubmissionDetails'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaBook from '@fortawesome/fontawesome-free-solid/faBook'
import FaYouTube from '@fortawesome/fontawesome-free-brands/faYoutube'
import FaVimeo from '@fortawesome/fontawesome-free-brands/faVimeoV'
import FaStar from '@fortawesome/fontawesome-free-solid/FaStar'
import FaStarOpen from '@fortawesome/fontawesome-free-regular/FaStar'

import { getImageThumbnail, STATIC_PATH } from '../../utils'

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
      isFinalizeConfirmationOpen: false,
      isSubmissionModalOpen: false,
      viewingSubmission: null
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

  onDisplayFinalizeConfirmation = () => {
    this.setState({
      isFinalizeConfirmationOpen: true
    })
  }

  onDisplaySubmissionModal = submission => {
    this.setState({
      isSubmissionModalOpen: true,
      viewingSubmission: submission
    })
  }

  updateInvitation = (id, value) => {
    const { updateInvite } = this.props

    updateInvite(id, value)
  }

  render () {
    const { show, finalizeInvites } = this.props

    return (
      <Fragment>
        <Modal isOpen={this.state.isFinalizeConfirmationOpen} style={{ top: '25%' }}>
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
                      return <FontAwesomeIcon icon={FaYouTube} size='2x' />
                    } else {
                      return <FontAwesomeIcon icon={FaVimeo} size='2x' />
                    }
                  case 'OTHER':
                    // TODO: Should ends with .jpg should render the image thumbnail?
                    return <FontAwesomeIcon icon={FaBook} size='2x' />
                  default:
                    console.error(`Unexpected Type ${submission.entryType}`, submission)
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
                <div style={{ cursor: 'pointer' }} onClick={() => this.onDisplaySubmissionModal(submission)}>
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
              Header: 'Invited',
              accessor: 'invited',
              Cell: ({ original: submission }) =>
                submission.invited ? (
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.updateInvitation(submission.id, false)}
                  >
                    <FontAwesomeIcon icon={FaStar} size='lg' className='align-middle' style={{ color: 'gold' }} />
                  </span>
                ) : (
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.updateInvitation(submission.id, true)}
                  >
                    <FontAwesomeIcon icon={FaStarOpen} size='lg' className='align-middle' />
                  </span>
                ),
              style: { textAlign: 'center' },
              width: 80
            }
          ]}
        />
        <Modal isOpen={this.state.isSubmissionModalOpen} toggle={this.onDismissSubmissionModal} style={{ minWidth: '50%' }}>
          <ModalHeader toggle={this.onDismissSubmissionModal}></ModalHeader>
          <ModalBody>
            <ShowSubmissionDetails submission={this.state.viewingSubmission} />
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}

export default ShowSubmissionsTab
