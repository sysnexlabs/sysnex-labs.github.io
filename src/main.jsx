import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import './styles/tailwind.css'
import reportWebVitals, { consoleReporter } from './utils/reportWebVitals'

// Ensure DOM is ready and handle errors gracefully
try {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    console.error('Root element not found!')
    document.body.innerHTML = '<div style="padding: 2rem; color: #00B4D8; font-family: sans-serif;"><h1>Error: Root element not found</h1><p>Please refresh the page.</p></div>'
  } else {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
} catch (error) {
  console.error('Failed to initialize React app:', error)
  document.body.innerHTML = `
    <div style="padding: 2rem; color: #00B4D8; font-family: sans-serif; background: #0A1628; min-height: 100vh;">
      <h1>Error Loading Application</h1>
      <p>${error.message}</p>
      <p>Please refresh the page or contact support if the problem persists.</p>
    </div>
  `
}

// Report Web Vitals metrics
// In production, you can replace consoleReporter with analyticsReporter
reportWebVitals(consoleReporter)


