import { graphql } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

import ShowsQuery from '../queries/shows.graphql'
import CreateShowMutation from '../mutations/createShow.graphql'
import CreateShowForm from '../components/CreateShowForm'

function mapDispatchToProps (dispatch) {
  return {
    done: () => dispatch(push('/'))
  }
}

const withRedux = connect(null, mapDispatchToProps)(CreateShowForm)

export default graphql(CreateShowMutation, {
  props: ({ mutate }) => ({
    create: show =>
      mutate({
        variables: { input: show }
      })
  }),
  options: () => ({
    refetchQueries: [
      {
        query: ShowsQuery
      }
    ]
  })
})(withRedux)
