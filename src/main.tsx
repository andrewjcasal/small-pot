import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import posthog from 'posthog-js'
import './index.css'
import App from './App.tsx'

posthog.init('phc_2Y9iMMdTWLZLDbxrNbSdtumXTrwwdKOm7clWoyKlXo2', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'anonymous',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
