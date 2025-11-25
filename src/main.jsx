import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Route_page from './routes'
import "./polyfills";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Route_page />
  </StrictMode>,
)
