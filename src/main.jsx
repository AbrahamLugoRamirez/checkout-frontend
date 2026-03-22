import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'

import { store } from './store' // 👈 importa el store

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> {/* 👈 ENVUELVE AQUÍ */}
      <App />
    </Provider>
  </StrictMode>,
)