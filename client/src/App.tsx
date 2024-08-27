import React, { useEffect, useState } from 'react';
import './styles/globals.css'

import Home from './components/Pages/Home';
import { User } from './Types/User';
import { notifyWarning } from './utils/utils';
import { Header } from './components/Header';
import LandingPage from './components/LandingPage';

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

  return (
    <>
      <Header user={user} setUser={setUser}/>
      <LandingPage/>
      {/* <Home user={user} setUser={setUser}/> */}
    </>
  );
}

export default App;
