import React from 'react'
import ReactDOM from 'react-dom/client'

import { legacy_createStore as createStore} from 'redux'


/*
  A reducer is a function that impacts the state in the store based on an action. It is given the current state and an action and returns a new state.

  A reducer is NEVER supposed to be called directly, instead it must be passed to `createStore`, which handles actions that are dispatched by the store
 */
const counterReducer = (state = 0, action) => {
  switch(action.type) {
    case 'INCREMENT': return state + 1
    case 'ZERO': return 0
    case 'DECREMENT': return state - 1
    default: return state
  }
}

const store = createStore(counterReducer)

const App = () => {
  return (
    <div>
      <div>
        {store.getState()}
      </div>
      <button 
        onClick={e => store.dispatch({ type: 'INCREMENT' })}
      >
        plus
      </button>
      <button 
        onClick={e => store.dispatch({ type: 'ZERO' })}
      >
        zero
      </button>
      <button
        onClick={e => store.dispatch({ type: 'DECREMENT' })}
      >
        minus
      </button>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

/**
  When the state of the store changes, React can't automatically re-render the App. Thus, the logic for rendering the App has been extracted to its own function. The .subscribe method has been assigned the renderApp method as a callback, to listen for state changes in the store, which will re-render the app.
 */
renderApp()
store.subscribe(renderApp)