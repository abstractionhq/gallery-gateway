import React, { Component } from 'react'
import ReactTable from 'react-table'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import FaYouTube from 'react-icons/lib/fa/youtube'
import FaVimeo from 'react-icons/lib/fa/vimeo'
import FaStar from 'react-icons/lib/fa/star'
import FaStarOpen from 'react-icons/lib/fa/star-o'
import FaBook from 'react-icons/lib/fa/book'

import { getImageThumbnail } from '../../utils'

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
    show: PropTypes.shape({
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

  constructor(props) {
    super(props)

    this.state = {
      alertVisible: false,
      alertType: ''
    }
  }

  updateShowInvite = value => {
    const { updateInvite } = this.props
    updateInvite(value)
      .then(() => {
        console.log('updated!!!')
      })
  }

  render () {
    const { show } = this.props

    return (
      <ReactTable
      defaultPageSize={20}
      data={show.entries}
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
                    src={`//localhost:3000/static/uploads/${getImageThumbnail(
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
                return <FaBook size='2em' />
              default:
                console.log(submission.entryType)
                return null
            }
          },
          sortable: false,
          style: { textAlign: 'center' },
          width: 150
        },
        {
          Header: 'Title',
          accessor: 'title'
        },
        {
          id: 'artist',
          Header: 'Artist',
          accessor: submission => {
            // Allows for sorting by student submitter's name
            const student = submission.student || submission.group.creator
            return `${student.lastName}${student.firstName}${student.username}`
          },
          Cell: ({ original: submission }) =>
            !submission.group ? (
              `${submission.student.lastName}, ${
              submission.student.firstName
              } (${submission.student.username})`
            ) : (
                <div>
                  <small>Group</small>
                  <p>
                    {submission.group.creator.lastName},{' '}
                    {submission.group.creator.firstName} ({
                      submission.group.creator.username
                    })
                </p>
                  <p>Participants: {submission.group.participants}</p>
                </div>
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
          accessor: 'score'
        },
        {
          Header: 'Invited',
          accessor: 'invited',
          Cell: ({ original: submission }) =>
            submission.invited ? (
              <a style={{ cursor: 'pointer' }}
              onClick={() => this.updateShowInvite(false)}>
                <FaStar size='1.5em' style={{ color: 'gold' }} />
              </a>
            ) : (
                <a style={{ cursor: 'pointer' }}
                onClick={() => this.updateShowInvite(true)}>
                  <FaStarOpen size='1.5em' />
                </a>
              ),
          style: { textAlign: 'center' },
          width: 80
        }
      ]}
    />
    )
  }
}

export default ShowSubmissionsTab
