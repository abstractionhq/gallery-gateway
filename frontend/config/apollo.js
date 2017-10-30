import { ApolloClient, createNetworkInterface } from 'react-apollo'

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:3000/graphql' // TODO: Read from .env
  })
})

export default client
