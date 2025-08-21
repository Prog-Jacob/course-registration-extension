import { PostHogProvider } from 'posthog-js/react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import React from 'react';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <PostHogProvider
      apiKey={process.env.REACT_APP_POSTHOG_KEY}
      options={{
        defaults: '2025-05-24',
        capture_exceptions: true,
        api_host: process.env.REACT_APP_POSTHOG_HOST,
        debug: process.env.NODE_ENV === 'development',
      }}
    >
      <App />
    </PostHogProvider>
  </React.StrictMode>
);
