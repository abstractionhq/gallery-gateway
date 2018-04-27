import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { push } from 'connected-react-router'

import { getDownloadToken } from '../../shared/actions'
import { downloadZip, downloadCsv } from '../actions'
import ShowDetailsTab from '../components/ShowDetailsTab'

import DeleteShow from '../mutations/deleteShow.graphql'
import ShowsQuery from '../queries/shows.graphql'

const mapDispatchToProps = (dispatch, ownProps) => ({
  downloadZip: () =>
    dispatch(getDownloadToken()).then(() =>
      dispatch(downloadZip(ownProps.show.id))
    ),
  downloadCsv: () =>
    dispatch(getDownloadToken()).then(() =>
      dispatch(downloadCsv(ownProps.show.id))
    ),
  doneDeleteShow: () => dispatch(push('/'))
})

export default compose(
  connect(null, mapDispatchToProps),
  graphql(DeleteShow, {
    props: ({ mutate, ownProps }) => ({
      deleteShow: () =>
        mutate({
          variables: {
            id: ownProps.show.id
          }
        })
    }),
    options: () => ({
      refetchQueries: [
        {
          query: ShowsQuery
        }
      ]
    })
  })
)(ShowDetailsTab)
