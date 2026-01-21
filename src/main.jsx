import React from 'react'
import ReactDOM from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import AuthWrapper from './components/AuthWrapper.jsx'
import { AppProvider } from './context/AppContext'
import './index.css'

// Import Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// Check if Clerk is configured
const isClerkConfigured = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'pk_test_your_publishable_key_here'

// Render app with or without Clerk based on configuration
if (isClerkConfigured) {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ErrorBoundary>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <AuthWrapper>
            <AppProvider>
              <App />
            </AppProvider>
          </AuthWrapper>
        </ClerkProvider>
      </ErrorBoundary>
    </React.StrictMode>
  )
} else {
  // Clerk not configured - render without authentication
  console.warn('Clerk not configured. Running without authentication.')
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ErrorBoundary>
        <AppProvider>
          <App />
        </AppProvider>
      </ErrorBoundary>
    </React.StrictMode>
  )
}
