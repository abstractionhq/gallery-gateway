import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import ManageStudentsTab from '../components/ManageStudentsTab'
import StudentsQuery from '../queries/students.graphql'
import EditUserMutation from '../mutations/editUser.graphql'
import { displayError } from '../../shared/actions'

const mapDispatchToProps = (dispatch) => ({
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(null, mapDispatchToProps),
  graphql(EditUserMutation, {
    props: ({ mutate }) => ({
      create: entry =>
        mutate({
          variables: { input: entry }
        })
    })
  }),
  graphql(StudentsQuery, {
    props: ({ data: { students, loading, error } }) => ({
      students,
      loading,
      error
    })
  })
)(ManageStudentsTab)
