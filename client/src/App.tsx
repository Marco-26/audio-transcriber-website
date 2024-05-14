import React, { useEffect, useState } from 'react';
import './styles/globals.css'

import Home from './components/Pages/Home';
import { User } from './shared/User';
import { RouterProvider,  createBrowserRouter } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import BaseLayout from './components/Pages/BaseLayout';
import ErrorPage from './components/Pages/ErrorPage';
import { Header } from './components/Header';
import axios, { AxiosResponse, AxiosError } from 'axios';

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  
  // useEffect(() => {
  //   const handleBeforeUnload = (event:any) => {
  //     event.preventDefault();
  //     event.returnValue = '';
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  // const router = createBrowserRouter([
  //   {
  //     path:'/',
  //     element:<BaseLayout user={user}/>,
  //     // errorElement:<ErrorPage />,
  //     children:[
  //       {
  //         path:'/',
  //         element:<Home user={user}/>
  //       },
  //       {
  //         path:'/login',
  //       },
  //       {
  //         path:'/signup',
  //         element:<SignupForm setUser={setUser}/>
  //       }
  //     ]
  //   }
  // ]);
  
  

  return (
      // <RouterProvider router={router} />
      <>
        {/* <Header user={user}/> */}
        <Home user={user}/>
      </>
  );
}

export default App;
