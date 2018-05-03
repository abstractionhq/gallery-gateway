import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { connect } from 'react-redux'

import ManageStudentsTab from '../components/ManageStudentsTab'
import StudentsQuery from '../queries/students.graphql'
import { displayError } from '../../shared/actions'

const mapDispatchToProps = (dispatch, { showId }) => ({
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(null, mapDispatchToProps),
  graphql(StudentsQuery, {
    props: ({ data: { students, loading, error } }) => ({
      students,
      loading,
      error
    })
  })
)(ManageStudentsTab)
