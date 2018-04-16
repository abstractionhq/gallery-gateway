import { connect } from 'react-redux'
import { compose } from 'recompose'

import { getDownloadToken } from '../../shared/actions'
import { downloadZip, downloadCsv } from '../actions'
import ShowDetailsTab from '../components/ShowDetailsTab'

const mapDispatchToProps = (dispatch, ownProps) => ({
  downloadZip: () =>
    dispatch(getDownloadToken()).then(() =>
      dispatch(downloadZip(ownProps.show.id))
    ),
  downloadCsv: () =>
    dispatch(getDownloadToken()).then(() =>
      dispatch(downloadCsv(ownProps.show.id))
    )
})

export default compose(connect(null, mapDispatchToProps))(ShowDetailsTab)
