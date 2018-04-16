import { connect } from 'react-redux'

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

export default connect(null, mapDispatchToProps)(ShowDetailsTab)
