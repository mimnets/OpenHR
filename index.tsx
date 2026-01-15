import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Standard relative registration is the most robust way to ensure the origin matches
    // the current document, which is required for Service Workers.
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('OpenHR PWA ServiceWorker registered at scope:', registration.scope);
      })
      .catch(error => {
        // Log warning but don't break the app; PWA features are progressive enhancements.
        // In some sandboxed preview environments, Service Workers are restricted by origin policies.
        console.warn('OpenHR PWA ServiceWorker registration skipped or failed:', error);
      });
  });
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (err) {
  console.error("React Render Crash:", err);
  if (window.onerror) {
    window.onerror(String(err), "index.tsx", 0, 0, err as Error);
  }
}