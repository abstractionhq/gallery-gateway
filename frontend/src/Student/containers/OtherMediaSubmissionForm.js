import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

import OtherMediaSubmissionForm from '../components/OtherMediaSubmissionForm'
import CreateOtherMediaEntry from '../mutations/createVideoEntry.graphql'

const mapDispatchToProps = (dispatch) => ({
  done: () => dispatch(push('/'))
})

const withRedux = connect(null, mapDispatchToProps)(OtherMediaSubmissionForm)

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
