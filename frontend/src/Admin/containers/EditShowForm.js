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

const addIdFromQueryParams = () => {
  return window.location.search.split('=')[1]
}

export default compose(
  connect(null, mapDispatchToProps),
  graphql(EditShowMutation, {
    props: ({ mutate }) => ({
      update: show =>
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
  })
)(EditShowForm)
