import React, { useEffect, useState } from 'react';
import './styles/globals.css'

import Dashboard from './components/Pages/Dashboard';
import { User } from './types/User';
import { notifyWarning } from './utils/utils';
import LandingPage from './components/LandingPage';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Layout from './components/Layout';
import { ToastContainer } from 'react-toastify';

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  
  useEffect(() => {
    notifyWarning("Access restricted. This application is currently in testing.")
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
