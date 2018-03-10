import { connect } from 'react-redux'
import { closeStatus } from '../actions'
import Status from '../components/Status'

function mapStateToProps (store, props) {
  return {
    warning: store.status.warning || '',
    error: store.status.error || '',
    loading: !!props.type.find(type => Object.values(store.status.loading).includes(type))
  }
}

function mapDispatchToProps (dispatch) {
  return {
    close: () => dispatch(closeStatus())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Status)
