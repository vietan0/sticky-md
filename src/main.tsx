import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import UserContextProvider from './contexts/UserContext.tsx';
import ThemeContextProvider from './contexts/ThemeContext.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeContextProvider>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </ThemeContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
