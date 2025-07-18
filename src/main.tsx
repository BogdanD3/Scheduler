import { RoleProvider } from './Contexts/RoleContext.tsx'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './Contexts/AuthContext.tsx';


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RoleProvider>
      <AuthProvider >
      <App />
      </AuthProvider>
    </RoleProvider>
  </React.StrictMode>
);
