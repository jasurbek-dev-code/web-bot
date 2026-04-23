import React from 'react';
import ReactDOM from 'react-dom/client';
import '@/styles/index.css';
import App from '@/App';
import { applyRuntimeCsp } from '@/bootstrap/csp';

applyRuntimeCsp();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

