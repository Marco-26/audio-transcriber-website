import React, { useEffect, useState } from 'react';
import './styles/globals.css'

import Dashboard from './pages/Dashboard';
import { User } from './types/User';
import LandingPage from './pages/LandingPage';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Layout from './pages/Layout';
import { ToastContainer } from 'react-toastify';

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  
  useEffect(() => {
    const handleBeforeUnload = (event:any) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout user={user} setUser={setUser} />,
      children: [
        {
          index: true,
          element: <LandingPage />,
        },
        {
          path: 'dashboard',
          element: <Dashboard user={user} setUser={setUser} />,
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router}/>
      <ToastContainer/>
    </>
  );
}

export default App;
