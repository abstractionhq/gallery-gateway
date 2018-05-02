import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Button, Row, Col, Badge } from 'reactstrap'
import moment from 'moment'
import Moment from 'react-moment'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FaImage from '@fortawesome/fontawesome-free-regular/faImage'
import FaVideo from '@fortawesome/fontawesome-free-solid/faVideo'
import FaBook from '@fortawesome/fontawesome-free-solid/faBook'

const Card = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  margin-top: 15px;
  padding: 10px;
  width: 100%;
`

// NOTE: Only 1 child should be provided
const FormattedDate = (props) => (
  <Moment
    title={moment(props.children).format('MMMM D, YYYY hh:mm:ss a')}
    format='MMMM D, YYYY'
  >
    {props.children}
  </Moment>
)

class ShowCard extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    entryStart: PropTypes.string.isRequired,
    entryEnd: PropTypes.string.isRequired,
    judgingStart: PropTypes.string.isRequired,
    judgingEnd: PropTypes.string.isRequired,
    entries: PropTypes.arrayOf(
      PropTypes.shape({
        entryType: PropTypes.string.isRequired
      })
    )
  }

  renderOpenClose = (opens, closes) => (
    <Fragment>
      <dl style={{width: '50%'}} className='d-inline-block'>
        <dt>{moment().isBefore(moment(opens)) ? 'Opens:' : 'Opened:' }</dt>
        <dd><FormattedDate>{opens}</FormattedDate></dd>
      </dl>
      <dl style={{width: '50%'}} className='d-inline-block'>
        <dt>{moment().isBefore(moment(closes)) ? 'Closes:' : 'Closed:' }</dt>
        <dd><FormattedDate>{closes}</FormattedDate></dd>
      </dl>
    </Fragment>
  )

  renderSubmissionSummary = (props) => {
    const totalSubmissions = props.entries.length
    const totalPhotoSubmissions = props.entries.filter(entry => entry.entryType === 'PHOTO').length
    const totalVideoSubmissions = props.entries.filter(entry => entry.entryType === 'VIDEO').length
    const totalOtherSubmissions = props.entries.filter(entry => entry.entryType === 'OTHER').length

    return (
      <Fragment>
        <h4>Submissions: <Badge color='primary'>{totalSubmissions}</Badge></h4>
        <div>
          <FontAwesomeIcon icon={FaImage} className='mr-2' />
          <h6 className='text-bold d-inline-block'>
            Photos: <Badge color='dark'>{totalPhotoSubmissions}</Badge>
          </h6>
        </div>
        <div>
          <FontAwesomeIcon icon={FaVideo} className='mr-2' />
          <h6 className='text-bold d-inline-block'>
            Videos: <Badge color='dark'>{totalVideoSubmissions}</Badge>
          </h6>
        </div>
        <div>
          <FontAwesomeIcon icon={FaBook} className='mr-2' />
          <h6 className='text-bold d-inline-block'>
            Other: <Badge color='dark'>{totalOtherSubmissions}</Badge>
          </h6>
        </div>
      </Fragment>
    )
  }

  renderClosedShow = ({ entryStart, judgingEnd }) => (
    <Row>
      <Col className='mb-3'>
        <h4>Closed Show</h4>
        <FormattedDate>{entryStart}</FormattedDate>
        {' - '}
        <FormattedDate>{judgingEnd}</FormattedDate>
      </Col>
    </Row>
  )

  renderBody = (props) => {
    const {
      entryStart,
      entryEnd,
      judgingStart,
      judgingEnd
    } = props

    const now = moment()
    const isShowInFuture = now.isBefore(moment(entryStart))
    const isShowInSubmission = now.isAfter(moment(entryStart)) && now.isBefore(moment(entryEnd))
    const isShowBetweenSubmissionAndJudging = now.isAfter(moment(entryEnd)) && now.isBefore(moment(judgingStart))
    const isShowInJudging = now.isAfter(moment(judgingStart)) && now.isBefore(moment(judgingEnd))
    const isShowClosed = now.isAfter(moment(judgingEnd))

    if (isShowClosed) {
      return this.renderClosedShow(props)
    }

    // Dynamically set the sub-heading based on the show state
    let subHeading1 = ''
    let subHeading2 = ''

    if (isShowInFuture) {
      subHeading1 = 'Pre Show'
      subHeading2 = 'Pre Judging'
    } else if (isShowInSubmission) {
      subHeading1 = 'Accepting Submissions'
      subHeading2 = 'Pre Judging'
    } else if (isShowBetweenSubmissionAndJudging) {
      subHeading1 = 'No Longer Accepting Submissions'
      subHeading2 = 'Pre Judging'
    } else if (isShowInJudging) {
      subHeading1 = 'No Longer Accepting Submissions'
      subHeading2 = 'Judging In Progress'
    }

    // We render Submission Period and Judging Period in two columns,
    // except for when the show is in submission, we render the summary info
    // in the second column and move the judging info below the submission period info
    return (
      <Row>
        <Col xs='12' md='6'>
          <h4>Submission Period</h4>
          <h6>{subHeading1}</h6>
          {this.renderOpenClose(entryStart, entryEnd)}
          {isShowInSubmission ? (
            <Fragment>
              <h4>Judging Period</h4>
              <h6>{subHeading2}</h6>
              {this.renderOpenClose(judgingStart, judgingEnd)}
            </Fragment>
          ) : null}
        </Col>
        <Col xs='12' md='6'>
          {isShowInSubmission
            ? this.renderSubmissionSummary(props)
            : (
              <Fragment>
                <h4>Judging Period</h4>
                <h6>{subHeading2}</h6>
                {this.renderOpenClose(judgingStart, judgingEnd)}
              </Fragment>
            )}
        </Col>
      </Row>
    )
  }

  renderButtons = (props) => (
    <Row>
      <Col>
        <Button
          color='primary'
          className='mr-4'
          style={{ cursor: 'pointer' }}
          tag={Link}
          to={`/show/${props.id}`}
          block
          outline
        >
          View Details
        </Button>
        <Button
          color='primary'
          style={{ cursor: 'pointer' }}
          tag={Link}
          to={`/show/${props.id}/submissions`}
          block
          outline
        >
          View Submissions
        </Button>
      </Col>
      <Col>
        <Button
          className='mr-4'
          color='primary'
          style={{ cursor: 'pointer' }}
          tag={Link}
          to={`/show/${props.id}/judges`}
          block
          outline
        >
          View Progress
        </Button>
        <Button
          color='primary'
          style={{ cursor: 'pointer' }}
          tag={Link}
          to={`/show/${props.id}/judges/assign`}
          block
          outline
        >
          Assign Judges
        </Button>
      </Col>
    </Row>
  )

  render () {
    return (
      <Card>
        <h2>
          <Link to={`show/${this.props.id}`}>{this.props.name}</Link>
        </h2>
        {this.renderBody(this.props)}
        {this.renderButtons(this.props)}
      </Card>
    )
  }
}

export default ShowCard
