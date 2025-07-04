import React from 'react'
import ReactDOM from 'react-dom/client'

import { legacy_createStore as createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

import { filterChange } from './reducers/filterReducer'
import { createNote } from './reducers/noteReducer'

import App from './App'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})
const store = createStore(reducer)

console.log(store.getState())
store.subscribe(() => console.log(store.getState()))
store.dispatch(filterChange('IMPORTANT'))
store.dispatch(createNote('combineReducers forms one reducer from many simple reducers'))
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <App/>
  </Provider>
)

/* root.render(
  <Provider store={store}>
    <div/>
  </Provider>
) */
