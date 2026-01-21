import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Session initialization logic - runs immediately on module load
// This ensures that the flags are set before any components render (avoiding race conditions)
if (typeof window !== 'undefined') {
  const hasSessionStarted = sessionStorage.getItem('sessionStarted');
  if (!hasSessionStarted) {
    // Check if we are landing on the home page
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
      sessionStorage.setItem('shouldPlayIntro', 'true');
    }
    sessionStorage.setItem('sessionStarted', 'true');
  }
}

import App from './App.jsx'
import { AdminAuthProvider } from './admin/context/AuthContext'
import { DataProvider } from './admin/context/DataContext'

// Viewport Height Fix - ONE-TIME calculation to avoid reflows
// Only runs on load and orientation change, NOT on scroll
const setViewportHeight = () => {
  // Get the actual viewport height
  const vh = window.innerHeight * 0.01;
  // Set custom property for fallback use in CSS
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initial call on page load
setViewportHeight();

// Update ONLY on orientation change (not resize, not scroll)
let orientationTimeout;
window.addEventListener('orientationchange', () => {
  clearTimeout(orientationTimeout);
  orientationTimeout = setTimeout(setViewportHeight, 100);
}, false);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminAuthProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </AdminAuthProvider>
  </StrictMode>,
)
