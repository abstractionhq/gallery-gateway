import React, { Fragment, Component } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import styled from 'styled-components'

import ShowForPrinting from '../queries/showForPrinting.graphql'
import { STATIC_PATH } from '../../utils'
import Loading from '../../shared/components/Loading'

const PageContainer = styled.div`
  font-size: 16pt;

  @media screen {
    margin: 1em auto 1em auto;
    padding: 0 0 1em 0;
    width: 75%;
    border-bottom: 1px solid black;
  }

  @media print {
    page-break-after: always;
  }
`
const LoadingContainer = styled.div`
  margin-bottom: 25px;

  @media print {
    display: none !important;
  }
`

const YOUTUBE_BASE_URL = 'https://www.youtube.com/watch?v='
const VIMEO_BASE_URL = 'https://vimeo.com/'

class PrintableReport extends Component {
  state = {
    allImagesLoaded: false
  }

  loadedImagePaths = new Set()

  componentDidMount () {
    document.title = `Gallery Guide - ${this.props.show.name}`
  }

  onImageLoaded (path) {
    // Trigger print after all images have been loaded
    this.loadedImagePaths.add(path)

    const entriesWithImage = this.props.displayEntries.filter(
      e => e.path && e.path.endsWith('.jpg')
    )
    const allPaths = entriesWithImage.map(e => e.path)

    // If all paths are now loaded, we are ready to print
    if (allPaths.every(path => this.loadedImagePaths.has(path))) {
      this.setState({
        allImagesLoaded: true
      })
      setTimeout(window.print, 1000)
    }
  }

  render () {
    const { loading, show, displayEntries: entries } = this.props

    if (loading) {
      return <Loading />
    }

    return (
      <Fragment>
        {this.state.allImagesLoaded || entries.length === 0 ? null : (
          <LoadingContainer>
            <Loading />
          </LoadingContainer>
        )}
        <PageContainer>
          <h1>Gallery Guide</h1>
          <h2>{show.name}</h2>
          <p>Entries: {entries.length}</p>
          <p style={{ paddingLeft: '2em' }}>
            Images: {entries.filter(e => e.entryType === 'PHOTO').length}
          </p>
          <p style={{ paddingLeft: '2em' }}>
            Videos: {entries.filter(e => e.entryType === 'VIDEO').length}
          </p>
          <p style={{ paddingLeft: '2em' }}>
            Other: {entries.filter(e => e.entryType === 'OTHER').length}
          </p>
        </PageContainer>
        {// Create a page for each entry
          entries.map(entry => (
            <PageContainer>
              <h1>{entry.title}</h1>
              <h3>
                {entry.student.lastName}, {entry.student.firstName} -{' '}
                {entry.student.username}@rit.edu
              </h3>
              {entry.path && entry.path.endsWith('.jpg') ? (
                <img
                  src={`${STATIC_PATH}${entry.path}`}
                  alt='submission'
                  onLoad={() => this.onImageLoaded(entry.path)}
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '90%',
                    maxHeight: '60vh'
                  }}
                />
              ) : null}
              <dl>
                {entry.group ? (
                  <Fragment>
                    <dt>Group Members</dt>
                    <dd>{entry.group.participants}</dd>
                  </Fragment>
                ) : null}
                <dt>Entry Type</dt>
                <dd>
                  {/* Turns the entryType into title-case */}
                  {entry.entryType.charAt(0).toUpperCase() +
                  entry.entryType.substr(1).toLowerCase()}
                </dd>
                {entry.comment ? (
                  <Fragment>
                    <dt>Artist Comment</dt>
                    <dd>
                      {entry.comment.substr(0, 400)}
                      {entry.comment.length > 400 ? '...' : ''}
                    </dd>
                  </Fragment>
                ) : null}
                <dt>For Sale?</dt>
                <dd>{entry.forSale ? 'Yes' : 'No'}</dd>
                <dt>More Copies?</dt>
                <dd>{entry.moreCopies ? 'Yes' : 'No'}</dd>
                {// Photo-specific details
                  entry.entryType === 'PHOTO' ? (
                    <Fragment>
                      <dt>Media Type</dt>
                      <dd>{entry.mediaType}</dd>
                      <dt>Dimensions</dt>
                      <dd>
                        {entry.horizDimInch} in. horizontal &times;{' '}
                        {entry.vertDimInch} in. vertical
                      </dd>
                    </Fragment>
                  ) : null}
                {// Video-specific details
                  entry.entryType === 'VIDEO' ? (
                    <Fragment>
                      <dt>Video Link</dt>
                      <dd>
                        {entry.provider === 'youtube'
                          ? `${YOUTUBE_BASE_URL}${entry.videoId}`
                          : entry.provider === 'vimeo'
                            ? `${VIMEO_BASE_URL}${entry.videoId}`
                            : 'unknown video provider'}
                      </dd>
                    </Fragment>
                  ) : null}
                {/* Other Media has no additional details */}
              </dl>
            </PageContainer>
          ))}
      </Fragment>
    )
  }
}

export default compose(
  graphql(ShowForPrinting, {
    options: ownProps => ({
      variables: {
        id: ownProps.match.params.id
      }
    }),
    props: ({ data: { show, loading } }) => ({
      show,
      displayEntries: loading
        ? null
        : show.entries.filter(e => e.invited && !e.excludeFromJudging),
      loading
    })
  })
)(PrintableReport)
