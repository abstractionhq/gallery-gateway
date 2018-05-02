import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import CreateAdminMutation from '../mutations/createAdmin.graphql'
import CreateUserForm from '../components/CreateUserForm'
import { addAdmin } from '../actions'
import { displayError } from '../../shared/actions'

const mapStateToProps = () => ({
  heading: 'Add New Admin'
})

const mapDispatchToProps = dispatch => ({
  myAddAdmin: admin => dispatch(addAdmin(admin)),
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(CreateAdminMutation, {
    props: ({ mutate, ownProps: { myAddAdmin } }) => ({
      create: admin =>
        mutate({
          variables: { input: admin }
        }).then(({ data: { createAdmin } }) => myAddAdmin(createAdmin))
    })
  })
)(CreateUserForm)
