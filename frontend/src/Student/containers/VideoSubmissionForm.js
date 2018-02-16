import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

import VideoSubmissionForm from '../components/VideoSubmissionForm'
import CreateVideoEntry from '../mutations/createVideoEntry.graphql'
import ShowName from '../queries/showName.graphql'

const mapStateToProps = (state) => ({
  user: state.shared.auth.user
})

const mapDispatchToProps = (dispatch) => ({
  done: () => dispatch(push('/'))
})

const withRedux = connect(mapStateToProps, mapDispatchToProps)(VideoSubmissionForm)

const withMutations = compose(
  graphql(CreateVideoEntry, {
    props: ({mutate}) => ({
      create: (entry) => mutate({
        variables: { input: entry }
      })
    })
  }),
  graphql(ShowName, {
    options: ( ownProps ) => ({
      variables: {
        id: ownProps.match.params.id
      }
    })
  })
)(withRedux)

export default withMutations
