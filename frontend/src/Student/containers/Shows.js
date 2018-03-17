import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import { compose } from 'recompose'

import ShowsQuery from '../queries/shows.graphql'
import Shows from '../components/Shows'

const mapStateToProps = state => ({
  studentUsername: state.shared.auth.user.username
})

export default compose(
  connect(mapStateToProps, null),
  graphql(ShowsQuery, {
    props: ({ data: { shows, loading } }) => ({
      shows,
      loading
    }),
    options: ownProps => ({
      variables: {
        studentUsername: ownProps.studentUsername
      }
    })
  })
)(Shows)
