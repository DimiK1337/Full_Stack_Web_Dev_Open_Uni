import ReactDOM from 'react-dom/client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

import App from './App'

const client = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={client}>
    <App />
  </QueryClientProvider>
)