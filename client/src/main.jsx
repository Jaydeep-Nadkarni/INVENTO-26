import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AdminAuthProvider } from './admin/context/AuthContext'
import { DataProvider } from './admin/context/DataContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataProvider>
      <AdminAuthProvider>
        <App />
      </AdminAuthProvider>
    </DataProvider>
  </StrictMode>,
)
