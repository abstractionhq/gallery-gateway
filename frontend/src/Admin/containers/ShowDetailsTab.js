import { connect } from 'react-redux'

import { getDownloadToken } from '../../shared/actions'
import { downloadZip } from '../actions'
import ShowDetailsTab from '../components/ShowDetailsTab'

const mapDispatchToProps = (dispatch, ownProps) => ({
  downloadZip: () =>
    dispatch(getDownloadToken()).then(() =>
      dispatch(downloadZip(ownProps.show.id))
    )
})

export default connect(null, mapDispatchToProps)(ShowDetailsTab)
