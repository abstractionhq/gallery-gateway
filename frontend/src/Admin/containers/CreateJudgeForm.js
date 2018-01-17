import { graphql } from 'react-apollo'
import { connect } from 'react-redux'

import CreateJudgeMutation from '../mutations/createJudge.graphql'
import CreateJudgeForm from '../components/CreateJudgeForm'
import { addJudge } from '../actions'

const mapDispatchToProps = (dispatch) => ({
  myAddJudge: (judge) => dispatch(addJudge(judge))
})

const withMutations = graphql(CreateJudgeMutation, {
  props: ({mutate, ownProps: {myAddJudge}}) => ({
    create: (judge) => mutate({
      variables: { input: judge }
    }).then(({data: {createJudge}}) => myAddJudge(createJudge))
    // TODO catch errors
  })
})(CreateJudgeForm)

export default connect(null, mapDispatchToProps)(withMutations)
