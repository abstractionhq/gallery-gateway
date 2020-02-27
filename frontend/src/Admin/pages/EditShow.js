import React from 'react'
import { Container } from 'reactstrap'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import EditShowForm from '../containers/EditShowForm'
import ShowQuery from '../queries/show.graphql'

const EditShow = props => (
  <Container>
    <h1>Edit Show</h1>
    { props.show ? <EditShowForm show={props.show} /> : null }
  </Container>
)

export default compose(
  graphql(ShowQuery, {
    options: ownProps => ({
      variables: {
        id: ownProps.match.params.id
      }
    }),
    props: ({ data: { show, loading } }) => ({
      show,
      loading
    })
  })
) (EditShow)
