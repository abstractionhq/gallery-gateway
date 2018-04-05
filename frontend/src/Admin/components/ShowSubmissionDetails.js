import React from 'react'
import PropTypes from 'prop-types'

const ShowSubmissionDetails = ({ submission }) => (
  <div>
    <dl>
      <dt>Title</dt>
      <dd>{submission.title}</dd>
    </dl>
  </div>
)

ShowSubmissionDetails.propTypes = {
  submission: PropTypes.shape({
    group: PropTypes.shape({
      participants: PropTypes.string.isRequired
    }),
    student: PropTypes.shape({
      username: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired
    }),
    title: PropTypes.string.isRequired,
    comment: PropTypes.string.isRequired,
    forSale: PropTypes.bool.isRequired,
    invited: PropTypes.bool.isRequired,
    yearLevel: PropTypes.string.isRequired,
    academicProgram: PropTypes.string.isRequired,
    moreCopies: PropTypes.bool.isRequired,
    score: PropTypes.number.isRequired,
    entryType: PropTypes.string.isRequired,
    // For Photo or Other Entries
    path: PropTypes.string,
    // For Photo Entries
    horizDimInch: PropTypes.string,
    vertDimInch: PropTypes.string,
    mediaType: PropTypes.string,
    // For Video Entries
    provider: PropTypes.string,
    videoId: PropTypes.string
  })
}

export default ShowSubmissionDetails
