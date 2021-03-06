import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import CreateJudgeMutation from '../mutations/createJudge.graphql'
import CreateUserForm from '../components/CreateUserForm'
import { addJudge } from '../actions'
import { displayError } from '../../shared/actions'

const mapStateToProps = () => ({
  heading: 'Add New Judge'
})

const mapDispatchToProps = dispatch => ({
  myAddJudge: judge => dispatch(addJudge(judge)),
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(CreateJudgeMutation, {
    props: ({ mutate, ownProps: { myAddJudge } }) => ({
      create: judge =>
        mutate({
          variables: { input: judge }
        }).then(({ data: { createJudge } }) => myAddJudge(createJudge))
    })
  })
)(CreateUserForm)
