import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Row, Col } from 'reactstrap'

import { getImageThumbnail } from '../../utils'

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
            src={`//localhost:3000/static/uploads/${getImageThumbnail(
              submission.path
            )}`}
          />
          <dt>Dimensions</dt>
          <dd>{submission.horizDimInch} in. × {submission.vertDimInch} in.</dd>
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
              <a href={`${YOUTUBE_BASE_URL}${submission.videoId}`}>
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
              <a href={`${VIMEO_BASE_URL}${submission.videoId}`}>
                {`${VIMEO_BASE_URL}${submission.videoId}`}
              </a>
            </dd>
          </Fragment>
        )
      }
    case OTHER:
      return (
        <Fragment>
          <dt>Other</dt>
          <dd>
            <a href={submission.path}>
              {submission.path}
            </a>
          </dd>
        </Fragment>
      )
    default:
      console.error(`Unexpected Type ${submission.entryType}`, submission)
      return null
  }
}

const ShowSubmissionDetails = ({ submission }) => (
  <Row>
    <Col>
      <h4 className='text-center'>Artist(s)</h4>
      <dl>
        <dt>Name</dt>
        <dd>{submission.student.firstName} {submission.student.lastName} ({submission.student.username})</dd>
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
        {renderSubmissionByType(submission)}
        <dt>For Sale?</dt>
        <dd>{submission.forSale ? 'Yes' : 'No'}</dd>
        <dt>More Copies?</dt>
        <dd>{submission.moreCopies ? 'Yes' : 'No'}</dd>
      </dl>
    </Col>
  </Row>
)

ShowSubmissionDetails.propTypes = {
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
  })
}

export default ShowSubmissionDetails
