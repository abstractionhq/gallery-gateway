import { ApolloClient } from 'apollo-client'
import { HttpLink, InMemoryCache } from 'apollo-client-preset'

const client = new ApolloClient({
  link: new HttpLink({uri: 'http://localhost:3000/graphql'}), // TODO: Read from .env
  cache: new InMemoryCache()
})

export default client
