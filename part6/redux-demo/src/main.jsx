import React from 'react'
import ReactDOM from 'react-dom/client'

import { legacy_createStore as createStore} from 'redux'
import { Provider } from 'react-redux'

import noteReducer from './reducers/noteReducer'
import App from './App'

const store = createStore(noteReducer)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <App/>
  </Provider>
)
