import ReactDom from 'react-dom/client'
import App from './App'

import { 
  ApolloClient, 
  ApolloProvider,
  InMemoryCache,
  createHttpLink
} from '@apollo/client'

import { setContext } from '@apollo/client/link/context'

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

const httpLink = createHttpLink({
  uri: 'http://localhost:4000'
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})

ReactDom.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>
)