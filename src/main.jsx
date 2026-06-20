import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initAnalytics, trackAppOpen, trackPageView } from './services/firebase'

initAnalytics().catch(() => {
  // Keep app running even if analytics is unavailable.
})

trackAppOpen().catch(() => {
  // Ignore analytics errors in startup.
})

trackPageView(window.location.pathname + window.location.search).catch(() => {
  // Ignore analytics errors in startup.
})

createRoot(document.getElementById('root')).render(
  <App />,
)
