import React, { useState } from 'react';
import './styles/globals.css'

import Home from './components/Pages/Home';
import { User } from './shared/User';
import { RouterProvider,  createBrowserRouter } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import BaseLayout from './components/BaseLayout';
import ErrorPage from './components/Pages/ErrorPage';

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
      errorElement:<ErrorPage />,
      element:<BaseLayout user={user} setUser={setUser}/>,
      children:[
        {
          path:'/',
          element:<Home user={user}/>
        },
        {
          path:'/login',
          element:<LoginForm user={user} setUser={setUser}/>
        },
        {
          path:'/signup',
          element:<SignupForm setUser={setUser}/>
        }
      ]
    }
  ]);
  
  return (
      <RouterProvider router={router} />
  );
}

export default App;
