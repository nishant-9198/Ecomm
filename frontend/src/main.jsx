import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppProvider from './context/AppContext.jsx'
import { Toaster } from './components/ui/sonner'


createRoot(document.getElementById('root')).render(
    <StrictMode>
      <AppProvider>
        <App />
        <Toaster position="top-center" />
      </AppProvider>
    </StrictMode>
)
