import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Button } from 'reactstrap'

const ShowDetailsTab = ({ downloadCsv, downloadZip, show }) => (
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
      {/* TODO: Add Print / Download Icons Next to Buttons */}
      <Button color='dark' outline block>
        Print Gallery Guide
      </Button>
      <Button color='dark' outline block onClick={() => downloadCsv()}>
        Download CSV Report
      </Button>
      <Button color='dark' outline block onClick={() => downloadZip()}>
        Download Photo Submissions ZIP
      </Button>
    </Col>
  </Row>
)

ShowDetailsTab.propTypes = {
  show: PropTypes.shape({
    description: PropTypes.string,
    entryCap: PropTypes.string.isRequired
  }).isRequired,
  downloadZip: PropTypes.func.isRequired,
  downloadCsv: PropTypes.func.isRequired
}

export default ShowDetailsTab
