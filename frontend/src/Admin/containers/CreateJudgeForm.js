import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import CreateJudgeMutation from '../mutations/createJudge.graphql'
import CreateJudgeForm from '../components/CreateJudgeForm'
import { addJudge } from '../actions'
import { displayError } from '../../shared/actions'

const mapDispatchToProps = dispatch => ({
  myAddJudge: judge => dispatch(addJudge(judge)),
  handleError: message => dispatch(displayError(message))
})

export default compose(
  connect(null, mapDispatchToProps),
  graphql(CreateJudgeMutation, {
    props: ({ mutate, ownProps: { myAddJudge } }) => ({
      create: judge =>
        mutate({
          variables: { input: judge }
        }).then(({ data: { createJudge } }) => myAddJudge(createJudge))
    })
  })
)(CreateJudgeForm)
