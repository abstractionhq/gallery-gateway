import { ApolloClient } from 'apollo-client'
import { HttpLink, InMemoryCache } from 'apollo-client-preset'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'

import { GRAPHQL_PATH } from '../src/utils'

const httpLink = new HttpLink({uri: GRAPHQL_PATH})

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

const errorMiddleware = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    // TODO
    console.log(graphQLErrors)
  }
  if (networkError) {
    // TODO
    console.log(networkError)
  }
})

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: 'INTERFACE',
          name: 'Entry',
          possibleTypes: [
            {
              name: 'Photo'
            },
            {
              name: 'Video'
            },
            {
              name: 'OtherMedia'
            }
          ]
        }
      ]
    }
  }
})

const client = new ApolloClient({
  link: ApolloLink.from([
    errorMiddleware,
    authMiddleware,
    httpLink
  ]),
  cache: new InMemoryCache({
    dataIdFromObject: o => {
      switch (o.__typename) {
        case 'User':
          // The primary key of 'User' is 'username'
          return `User:${o.username}`
        default:
          return `${o.__typename}:${o.id}`
      }
    },
    fragmentMatcher: fragmentMatcher
  })
})

export default client
