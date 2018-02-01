import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

import OtherMediaSubmissionForm from '../components/OtherMediaSubmissionForm'
import CreateOtherMediaEntry from '../mutations/createVideoEntry.graphql'

const mapStateToProps = (state) => ({
  user: state.shared.auth.user
})

const mapDispatchToProps = (dispatch) => ({
  done: () => dispatch(push('/'))
})

const withRedux = connect(mapStateToProps, mapDispatchToProps)(OtherMediaSubmissionForm)

const withMutations = compose(
  graphql(CreateOtherMediaEntry, {
    props: ({mutate}) => ({
      create: (entry) => mutate({
        variables: { input: entry }
      })
    })
  })
)(withRedux)

export default withMutations
