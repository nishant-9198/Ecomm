import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AppProvider from './context/AppContext.jsx'
import { Toaster } from './components/ui/sonner'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5 // 5 minutes cache
    }
  }
});

createRoot(document.getElementById('root')).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <App />
          <Toaster position="top-center" />
        </AppProvider>
      </QueryClientProvider>
    </StrictMode>
)
