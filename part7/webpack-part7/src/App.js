import React from 'react' // we need this now also in component files
import { useState, useEffect } from 'react'

import axios from 'axios'

import PromisePolyfill from 'promise-polyfill'

if (!window.Promise) {
  window.Promise = PromisePolyfill
}

const useNotes = (url) => {  
  const [notes, setNotes] = useState([])
  console.log('url in useNotes (BACKEND_URL)', url)
  useEffect(() => {
    axios
      .get(url)
      .then(response => setNotes(response.data))
  }, [url])  
  return notes
}

const App = () => {
  const [counter, setCounter] = useState(0)
  const [values, setValues] = useState([])
  console.log("in App comp, BACKEND_URL=", BACKEND_URL)
  const notes = useNotes(BACKEND_URL)

  const handleClick = () => {
    setCounter(counter + 1)
    setValues(values.concat(counter))
  }

  return (
    <div className="container">
      hello webpack {counter} clicks
      <button onClick={handleClick}>press</button>
      <div>{notes.length} notes on server {BACKEND_URL}</div>    </div>
  )
}

export default App