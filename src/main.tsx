import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App'
import { applyTheme, useUIStore } from './stores/uiStore'
import { useAuthStore } from './stores/authStore'

applyTheme(useUIStore.getState().theme)
useAuthStore.getState().inicializar()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
