import { graphql } from 'react-apollo'
import { push } from 'connected-react-router'

import CreateShowMutation from '../mutations/createShow.graphql'
import CreateShowForm from '../components/CreateShowForm'

export default graphql(CreateShowMutation, {
  props: ({mutate}) => ({
    create: (show) => mutate({
      variables: { input: show }
    }) // TODO: On success, redirect to the Admin dashboard
  })
})(CreateShowForm)
