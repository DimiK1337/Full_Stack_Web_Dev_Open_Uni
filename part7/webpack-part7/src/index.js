// Needed for bundling async code
import 'core-js/stable/index.js'
import 'regenerator-runtime/runtime.js'

import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)