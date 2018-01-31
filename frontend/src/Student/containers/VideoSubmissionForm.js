import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

import VideoSubmissionForm from '../components/VideoSubmissionForm'
import CreateVideoEntry from '../mutations/createVideoEntry.graphql'

const mapDispatchToProps = (dispatch) => ({
  done: () => dispatch(push('/'))
})

const withRedux = connect(null, mapDispatchToProps)(VideoSubmissionForm)

const withMutations = compose(
  graphql(CreateVideoEntry, {
    props: ({mutate}) => ({
      create: (entry) => mutate({
        variables: { input: entry }
      })
    })
  })
)(withRedux)

export default withMutations