import { graphql } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { displayError } from '../../shared/actions'

import ShowsQuery from '../queries/shows.graphql'
import CreateShowMutation from '../mutations/createShow.graphql'
import ScholarshipForm from '../components/ScholarshipForm'

const mapDispatchToProps = dispatch => ({
  done: () => dispatch(push('/')),
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(null, mapDispatchToProps),
  graphql(CreateShowMutation, {
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
  })
)(ScholarshipForm)
