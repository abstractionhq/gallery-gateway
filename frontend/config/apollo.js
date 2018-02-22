import { ApolloClient } from 'apollo-client'
import { HttpLink, InMemoryCache } from 'apollo-client-preset'
import { ApolloLink, concat } from 'apollo-link'

const httpLink = new HttpLink({uri: 'http://localhost:3000/graphql'}) // TODO: Read from .env

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = localStorage.getItem('_token_v1')
  operation.setContext({
    headers: {
      authorization: token ? 'Bearer ' + token : null
    }
  })

  return forward(operation)
})

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache({
    dataIdFromObject: o => {
      switch (o.__typename) {
        case 'User':
          // The primary key of 'User' is 'username'
          return `User:${o.username}`
        default:
          return `${o.__typename}:${o.id}`
      }
    }
  })
})

export default client
