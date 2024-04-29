import React, { useState } from 'react';
import './styles/globals.css'

import { Header } from './components/Header';
import Home from './components/Pages/Home';
import { User } from './shared/User';
import { RouterProvider,  createBrowserRouter } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import path from 'path';

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
  const router = createBrowserRouter([
    {
      path:'/',
      element:<Home user={user}/>,
    },
    {
      path:'/login',
      element:<LoginForm user={user} setUser={setUser}/>
    }
  ]);
  
  return (
      <RouterProvider router={router} />
  );
}

export default App;
