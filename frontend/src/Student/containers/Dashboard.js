import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import { connect } from 'react-redux'

// import ShowsQuery from '../queries/shows.graphql'
import StudentShowCard from '../components/StudentShowCard'
//
// export default graphql(ShowsQuery, {
//   props: ({data: { shows, loading }}) => ({
//     shows,
//     loading
//   })
// })(Shows)
