import ReactDom from 'react-dom/client'
import App from './App'

import { 
  ApolloClient, 
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  split
} from '@apollo/client'

import { setContext } from '@apollo/client/link/context'

import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'

const authLink = setContext((previousContext, requestContext) => {
  const token = localStorage.getItem('library-user-token')
  const existingHeaders = requestContext.existingHeaders

  return {
    headers: {
      ...existingHeaders,
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

const uri = 'http://localhost:4000'
const httpLink = createHttpLink({ uri })
const wsLink = new GraphQLWsLink(createClient({
  url: uri
}))

/**
 * Split is needed to separate HTTP (queries and mutations (Q&M)) from WebSockets (Subscriptions). It routes subscriptions to ws and Q&M to HTTP
 */
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
  },
  wsLink, // Used when function above returns true
  authLink.concat(httpLink) // Used when function above returns false
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink
})

ReactDom.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>
)