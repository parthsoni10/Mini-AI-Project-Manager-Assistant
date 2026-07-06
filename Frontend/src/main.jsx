import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ExtractProvider } from './context/ExtractContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ExtractProvider>
        <App />
      </ExtractProvider>
    </BrowserRouter>
  </StrictMode>,
)

