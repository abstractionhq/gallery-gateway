import { graphql } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { compose, mapProps } from 'recompose'
import { displayError } from '../../shared/actions'

import ShowsQuery from '../queries/shows.graphql'
import EditShowMutation from '../mutations/editShow.graphql'
import EditShowForm from '../components/EditShowForm'

const mapDispatchToProps = dispatch => ({
  done: () => dispatch(push('/')),
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(null, mapDispatchToProps),
  graphql(EditShowMutation, {
    props: ({ mutate, ownProps }) => ({
      update: show =>
        mutate({
          variables: { id: ownProps.show.id, input: show }
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
)(EditShowForm)
