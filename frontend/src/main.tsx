import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';

// Polyfill Node Buffer for browser cryptography SDKs
if (!(window as any).Buffer) {
  (window as any).Buffer = Buffer;
}

import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
