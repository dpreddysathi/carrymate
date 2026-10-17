import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './auth/AuthContext';
import './styles.css';

async function boot() {
  // Demo builds (GitHub Pages) run without a backend: install the
  // in-memory mock API before anything renders. Normal builds skip this
  // and talk to the real backend via VITE_API_URL.
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    const { installMockApi } = await import('./mock-api');
    installMockApi();
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>,
  );
}

boot();
