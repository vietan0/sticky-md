import { HeroUIProvider } from '@heroui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App';
import Main from './components/Main/Main';
import ThemeProvider from './contexts/ThemeProvider';
import UserProvider from './contexts/UserProvider';
import Home from './routes/Home';
import NotFound from './routes/NotFound';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 3,
    },
  },
});

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <App error={<NotFound />} />,
    children: [
      {
        path: '/',
        element: <Home />,
        children: [
          { index: true, element: <Main /> },
        ],
      },
      { path: '/signin', element: <SignIn /> },
      { path: '/signup', element: <SignUp /> },
    ],
  },
];

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider disableAnimation>
        <ThemeProvider>
          <UserProvider>
            <RouterProvider router={router} />
          </UserProvider>
        </ThemeProvider>
      </HeroUIProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>,
);
