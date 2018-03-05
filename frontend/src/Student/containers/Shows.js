import { graphql } from 'react-apollo'

import ShowsQuery from '../queries/shows.graphql'
import { connect } from 'react-redux'
import Shows from '../components/Shows'

const mapStateToProps = state => ({
  studentUsername: state.shared.auth.user.username
})

const withRedux = connect(mapStateToProps, null)(
  Shows
)

export default graphql(ShowsQuery, {
  props: ({ data: { shows, loading } }) => ({
    shows,
    loading
  }),
  options: ownProps => ({
    variables: {
      studentUsername: ownProps.studentUsername
    }
  })
})(withRedux)
