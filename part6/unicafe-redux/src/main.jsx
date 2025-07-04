import React from 'react'
import ReactDOM from 'react-dom/client'

import { legacy_createStore as createStore} from 'redux'
import reducer from './reducer'

const store = createStore(reducer)

const App = () => {
  
  const clickDispatch = review => store.dispatch({ type: review })

  return (
    <div>
      <button onClick={() => clickDispatch('GOOD')}>good</button>
      <button onClick={() => clickDispatch('OK')}>ok</button>
      <button onClick={() => clickDispatch('BAD')}>bad</button>
      <button onClick={() => clickDispatch('ZERO')}>reset stats</button>
      <div>good {store.getState().good}</div>
      <div>ok {store.getState().ok}</div>
      <div>bad {store.getState().bad}</div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
