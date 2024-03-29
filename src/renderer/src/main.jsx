import './main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { allReducer } from './redux/reducers'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({ reducer: allReducer })
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
