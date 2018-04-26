import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row, Col, Button } from 'reactstrap'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaPDF from '@fortawesome/fontawesome-free-regular/faFilePdf'

import { getImageThumbnail, STATIC_PATH } from '../../utils'

// Submission types
const VIDEO = 'VIDEO'
const PHOTO = 'PHOTO'
const OTHER = 'OTHER'

const YOUTUBE_BASE_URL = 'https://www.youtube.com/watch?v='
const VIMEO_BASE_URL = 'https://vimeo.com/'

const PhotoThumbnail = styled.img`
  height: auto;
  max-height: 5em;
  max-width: 100%;
  min-width: 3em;
  width: auto;
`

const renderSubmissionByType = submission => {
  switch (submission.entryType) {
    case PHOTO:
      return (
        <Fragment>
          <PhotoThumbnail
            alt={submission.title}
            src={`${STATIC_PATH}${getImageThumbnail(submission.path)}`}
          />
          <dt>Dimensions</dt>
          <dd>
            {submission.horizDimInch} in. × {submission.vertDimInch} in.
          </dd>
          <dt>Media Type</dt>
          <dd>{submission.mediaType}</dd>
        </Fragment>
      )
    case VIDEO:
      if (submission.provider === 'youtube') {
        return (
          <Fragment>
            <dt>YouTube Video</dt>
            <dd>
              <a
                href={`${YOUTUBE_BASE_URL}${submission.videoId}`}
                target='_blank'
              >
                {`${YOUTUBE_BASE_URL}${submission.videoId}`}
              </a>
            </dd>
          </Fragment>
        )
      } else {
        return (
          <Fragment>
            <dt>Vimeo Video</dt>
            <dd>
              <a
                href={`${VIMEO_BASE_URL}${submission.videoId}`}
                target='_blank'
              >
                {`${VIMEO_BASE_URL}${submission.videoId}`}
              </a>
            </dd>
          </Fragment>
        )
      }
    case OTHER:
      if (!submission.path) {
        return null
      } else if (submission.path.endsWith('.jpg')) {
        return (
          <PhotoThumbnail
            alt={submission.title}
            src={`${STATIC_PATH}${getImageThumbnail(submission.path)}`}
          />
        )
      } else if (submission.path.endsWith('.pdf')) {
        return (
          <a href={`${STATIC_PATH}${submission.path}`} target='_blank'>
            <FaPDF /> View PDF
          </a>
        )
      }
      return null
    default:
      console.error(`Unexpected Type ${submission.entryType}`, submission)
      return null
  }
}

class ShowSubmissionDetails extends Component {
  static propTypes = {
    submission: PropTypes.shape({
      group: PropTypes.shape({
        participants: PropTypes.string
      }),
      student: PropTypes.shape({
        username: PropTypes.string.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        displayName: PropTypes.string
      }),
      title: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
      invited: PropTypes.bool,
      excludeFromJudging: PropTypes.bool,
      comment: PropTypes.string,
      yearLevel: PropTypes.string.isRequired,
      academicProgram: PropTypes.string.isRequired,
      forSale: PropTypes.bool.isRequired,
      moreCopies: PropTypes.bool.isRequired,
      entryType: PropTypes.string.isRequired,
      // For Photo or Other Entries
      path: PropTypes.string,
      // For Photo Entries
      horizDimInch: PropTypes.number,
      vertDimInch: PropTypes.number,
      mediaType: PropTypes.string,
      // For Video Entries
      provider: PropTypes.string,
      videoId: PropTypes.string
    }),
    handleError: PropTypes.func.isRequired,
    updateExcludeFromJudging: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
  }

  toggleExcludeFromJudging = () => {
    const { updateExcludeFromJudging, submission, handleError } = this.props
    updateExcludeFromJudging(submission.id, 
      !submission.excludeFromJudging).catch(err => handleError(err.message))
  }

  render () {
    const { submission } = this.props
    return (
      <Row>
        <Col>
          <h4 className='text-center'>Artist{submission.group ? 's' : null}</h4>
          <dl>
            <dt>Name</dt>
            <dd>
              {submission.student.firstName} {submission.student.lastName} ({
                submission.student.username
              })
            </dd>
            {submission.student.displayName ? (
              <Fragment>
                <dt>Artist Name</dt>
                <dd>{submission.student.displayName}</dd>
              </Fragment>
            ) : null}
            <dt>Year Level</dt>
            <dd>{submission.yearLevel}</dd>
            <dt>Academic Program</dt>
            <dd>{submission.academicProgram}</dd>
            {submission.group ? (
              <Fragment>
                <dt>Group Members</dt>
                <dd>{submission.group.participants}</dd>
              </Fragment>
            ) : null}
          </dl>
        </Col>
        <Col>
          <h4 className='text-center'>Submission</h4>
          <dl>
            <dt>Title</dt>
            <dd>{submission.title}</dd>
            {submission.comment ? (
              <Fragment>
                <dt>Artist&quot;s Comment</dt>
                <dd>{submission.comment}</dd>
              </Fragment>
            ) : null}
            <dt>Score</dt>
            <dd>{submission.score.toFixed(3)}</dd>
            <dt>Invited?</dt>
            <dd>{submission.invited ? 'Yes' : 'No'}</dd>
            {renderSubmissionByType(submission)}
            <dt>Excluded from Judging?</dt>
            <dd>{submission.excludeFromJudging ? 'Yes' : 'No'}</dd>
            <Button
              color={submission.excludeFromJudging ? 'primary' : 'danger'}
              size='sm'
              onClick={() => this.toggleExcludeFromJudging()}
            >
              {submission.excludeFromJudging
                ? 'Include In Judging'
                : 'Exclude from Judging'}
            </Button>
            <dt>For Sale?</dt>
            <dd>{submission.forSale ? 'Yes' : 'No'}</dd>
            <dt>More Copies?</dt>
            <dd>{submission.moreCopies ? 'Yes' : 'No'}</dd>
            {submission.entryType === PHOTO ? (
              <div className='text-center'>
                <a href={`${STATIC_PATH}${submission.path}`} target='_blank'>
                  <Button color='primary'>View Image</Button>
                </a>
              </div>
            ) : null}
          </dl>
        </Col>
      </Row>
    )
  }
}

export default ShowSubmissionDetails
