import { ApolloClient, createNetworkInterface } from 'react-apollo'

// TODO: Read from .env
const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:3000/graphql'
  })
})

export default client
